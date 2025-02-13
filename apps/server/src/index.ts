import express from "express"
import cors from "cors"
import mainRouter from "./routes/index"
import {createServer} from "node:http"
import SocketService from "./service/socket"
import cookieParser from "cookie-parser";
import cluster from 'node:cluster';
import { createAdapter,setupPrimary } from '@socket.io/cluster-adapter';
import * as dotenv from "dotenv";
import os from "os"

dotenv.config();

if(cluster.isPrimary){
   const numCPU = os.cpus().length;
   for(let i=0;i<1;i++){
      cluster.fork({
         PORT:parseInt(process.env.USE_PORT!)+i
      });
   }
   setupPrimary();

   cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });

}else{
   const app=express()
   const server=createServer(app)
   console.log(`Worker ${process.pid}`);
   app.use(cors({
      origin: ["http://localhost:3000" ,"http://localhost:3001" ,"http://localhost:5173"],
      credentials:true,  
      methods: ["GET", "POST", "PUT", "DELETE"]         
   }))
   SocketService.configure(server)
   app.use(express.json())
   app.use(express.urlencoded({extended:false}))
   app.use(cookieParser());
   app.use("/api/v1",mainRouter)
   app.get("/",(req,res)=>{
      res.status(200).json({
         message:`Success! ${process.pid}`
      })
   })
   const io=SocketService.getIo();
   io.adapter(createAdapter())
   server.listen(process.env.PORT,()=>{
      console.log(`server ${process.env.PORT}`);
   })
}