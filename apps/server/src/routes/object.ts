import express from "express"
import authMiddleWare from "../middleware"
import {  Request, Response } from 'express';
import {putObject,listObjects,getObject, createFolderIfNotExist, deleteItem, existsFolder} from "../service/s3Client"


const router=express.Router()

router.post("/putObject",async (req:Request,res:Response)=>{
    const putBody=req.body;
    try{
        const exists=await existsFolder(putBody.location);
        if(exists){
             res.status(500).json({
                message:"File exists"
            })
            return;
        }
        const url=await putObject(putBody.location,putBody.contentType?putBody.contentType:null);
        
    if(!url){
        res.status(401).json({
            message:"Try again"
        })
        return;
    }
    res.status(200).json({
        url,
        message:"Uploaded"
    })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Server Error"
        })
    }
    

})

router.post("/getObject",authMiddleWare,async (req:Request,res:Response)=>{
    const getBody=req.body;
    try{
        const {contentType,type,url}=await getObject(getBody.location);
        if(!url){
            res.status(401).json({
                message:"Try again"
            })
            return;
        }
        res.status(200).json({
            url,
            contentType,
            type,
            message:"Downloaded"
        })
    }catch(e){
        res.status(500).json({
            message:"Server Error"
        })
    }
})

router.post("/getList",authMiddleWare,async (req:Request, res:Response)=>{

    const lBody=req.body;
    try{
        const list=await listObjects(lBody.prefix, lBody.delimiter);
        if(list){
            res.status(200).json(list);
        }else{
            res.status(404).json({
                message:"Not Found"
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error"
        })
    }
    
});

router.post("/createFolder",authMiddleWare,async (req:Request,res:any)=>{
    const cfBody=req.body;
    try{
        const create=await createFolderIfNotExist(cfBody.key)
        if(create){
            res.status(200).json("Folder created");
        }else{
            res.status(401).json({
                message:"Folder already exists"
            })
        }
    }catch(e){
        return res.status(500).json({
            message:"Server Error"
        })
    }
})

router.post("/deleteObject",authMiddleWare,async (req:Request,res:any)=>{
    const dBody=req.body;
    try{
        const delItem=await deleteItem(dBody.key)
        if(delItem){
            res.status(200).json({
                message:"Deleted Successfully"
            })
        }else{
            res.status(403).json({
                message:"Not Found"
            })
        }
    }catch(e){
        res.status(500).json({
            message:"Server Error"
        })
    }
})

export default router