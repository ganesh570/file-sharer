import express from 'express'
import {  Request, Response, NextFunction } from 'express';
import SocketService from "../service/socket"
import {Socket} from "socket.io"
import {PrismaClient} from "@prisma/client"
import authMiddleWare from "../middleware"
import jwt from "jsonwebtoken";
import JWT_SECRET from "../service/config";
import { JwtPayload } from "jsonwebtoken";
import {createFolderIfNotExist } from "../service/s3Client"

interface MsgObject{
        message:string,
        grpId:number
}

const router=express.Router();

const io=SocketService.getIo();
const prisma=new PrismaClient();

router.post("/create_grp",authMiddleWare,async (req:Request,res:Response)=>{
   const gBody=req.body;
   try{
    const token=req.cookies.token;
    const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload;
    const response=await prisma.group.create({
        data:{
            name:gBody.name,
            description:gBody.description
        }
    })

    if(!response){
        res.status(400).json({
            message:"Try again"
        })
        return;
    }
   
        const result=await prisma.userGroup.create({
            data:{
                userId:decoded.userId.id,
                groupId:response.id
            }
        })
        if(!result){
            res.status(400).json({
                message:"Try again"
            })
            return;
        }

        const fol=await createFolderIfNotExist(`group-${response.id}/`);
        if(!fol) return;
        res.status(200).json({
            message:"Group created"
        })
    }catch(e){
        console.log(e)
        res.status(404).json({
            message:"Not Found"
        })
    }
    
})

router.post("/join_grp",authMiddleWare,async (req:Request,res:Response)=>{
    try{
        const gBody=req.body;
        const token=req.cookies.token;
        const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload
        const response=await prisma.userGroup.create({
            data:{
                userId:decoded.userId.id,
                groupId:gBody.groupId
            }
        })
        if(!response){
            res.status(400).json({
                message:"Couldn't add you to the group"
            })
            return;
        }
        res.status(200).json({
            groupId:response.groupId,
            Date:response.assignedAt,
            message:"You have been added to the group"
        })
    }catch(e){
        console.log(e)
        res.status(400).json({
            message:"Couldn't add you to the group"
        })
    }

    
})

router.post("/get_groups",authMiddleWare,async (req:Request,res:Response)=>{
    
    try{
        const ggBody=req.body;
        const response=await prisma.userGroup.findMany({
            where:{
                userId:ggBody.id
            },
            select:{
                groupId:true
            }
        })
        if(!response){
            res.status(403).json({
                message:"Try again"
            })
        }
        const arr:number[]=response.map((ele)=>{
                return ele.groupId
        });
        const result=await prisma.group.findMany({
            where:{
                id:{
                    in:arr
                }
            }
        })
        if(!result){
            res.status(403).json({
                message:"Try again"
            })
        }
        res.status(200).json({
            result

        })

        
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Server Error"
        })
    }

})

router.post("/retrieve",authMiddleWare,async (req:Request,res:Response)=>{
    const rBody=req.body;
    try{
        const response=await prisma.message.findMany({
            where:{
                groupId:rBody.groupId,
            },
            orderBy:{
                createdAt:"asc"
            }
        })
        if(!response){
            res.status(404).json({
                message:"Not Found"
            })
        }
        res.status(200).json({
            response
        })
    }catch{
        res.status(500).json({
            message:"Server Error"
        })
    }
})

router.get("/search",authMiddleWare,async (req:Request,res:Response)=>{
    const filter:any=req.query.filter || "";
    try{
        const groups=await prisma.group.findMany({ where: { name: { startsWith: filter } } })
        res.status(200).json(groups)
    }catch(e){
        res.status(500).json({
            message:'Server Error'
        })
    }
})

io.use((socket:Socket, next) => {
    
    try{
        const token=socket.handshake.auth.cookie
        if(!token){
            return next(new Error("Authentication Error"))
        }
        const decoded=jwt.verify(token,JWT_SECRET);
        next();

    }catch(e){
        return next(new Error("Authentication Error"))
    }
});


io.on('connection',(socket:Socket)=>{
    console.log(`User Connected ${socket.id}`);
    socket.on('message',async ({message,grpId}:MsgObject)=>{
    try {
        const token=socket.handshake.auth.cookie
        const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload;
        const response=await prisma.message.create({
            data:{
                content:message,
                userId:decoded.userId.id,
                groupId:grpId,
                createdAt:new Date()
            }
        })
        if(!response){
            return;
        } 
    } catch (e) {
        console.log(e);
        return;
    }
    io.to("group-"+grpId.toString()).emit("message",message)
    })

    socket.on('join-group', (grpId:number) => {
        socket.join("group-"+grpId.toString());
    });

    socket.on("success",({message,grpId}:MsgObject)=>{
        io.to("group-"+grpId.toString()).emit("success",message)
    })

    socket.on("disconnect",()=>{
        console.log(`User Disconnected ${socket.id}`)
    })
})
    

export default router;

