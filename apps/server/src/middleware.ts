import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "./service/config"
import { Response, NextFunction } from 'express';


const authMiddleWare=(req:any,res:any,next:NextFunction)=>{
   try{
    const token=req.cookies.CLIENT_TOKEN;
    const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload
    if(decoded.userId){
        req.userId=decoded.userId
        next();
    }else{
        res.status(401).json({
            message:"Invalid ID"
        })
    }

   }catch(e){
        console.log(e)
        res.status(401).json({
            message:"Invalid ID"
        })
   }

}

export default authMiddleWare;