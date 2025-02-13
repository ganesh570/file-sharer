import express from "express"
import { Request,Response } from "express"
import zod from "zod"
import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "../service/config"
import bcrypt from "bcrypt"
import authMiddleWare from "../middleware"
import cookieParser from "cookie-parser"
import { PrismaClient } from "@prisma/client"


const router=express.Router()

const saltRounds = 10;
router.use(cookieParser());
const prisma=new PrismaClient();

router.get("/",(req,res)=>{
    res.json({
        message:"Hello World!",
    })
})

const signupSchema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6),
    name:zod.string().min(2),
})
const signinSchema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6),
})

type SignUpBody=zod.infer<typeof signupSchema>
type SignInBody=zod.infer<typeof signinSchema>

router.post("/signup",async (req:Request,res:Response)=>{
    const upBody:SignUpBody=req.body;
    const {success}=signupSchema.safeParse(upBody)
    if(success){
        try{
            const hashedPassword=await bcrypt.hash(upBody.password, saltRounds);
            const response=await prisma.user.create({
                data:{
                    email:upBody.email,
                    password:hashedPassword,
                    name:upBody.name
                }
            })
            const token=jwt.sign({
                    data:response
                },JWT_SECRET);

            res.status(200).cookie("token",token,{ httpOnly: false, secure: true, sameSite: "none" }).json({
                message:"Account Created!"
            });
            
        }catch(e){
            console.log(e)
            res.status(401).json({
                message:"Error!"
            })
        }
    }else{
        res.status(401).json({
            message:"Provide correct credentials"
        })
        return;
    }

})

router.post("/signin",async (req:Request,res:Response)=>{
    const InBody:SignInBody=req.body;
    const {success}=signinSchema.safeParse(InBody)
    if(success){
        try{
            
            const response=await prisma.user.findUnique({
                where: {
                    email:InBody.email
                },
            })
            
            if(!response){
                res.status(401).json({
                    message:"Error!"
                })
                return;
            }
         
            const suc=await bcrypt.compare(InBody.password,response.password)
            if(!suc){
                res.status(401).json({
                    message:"Error!"
                })
                return;
            }
            const token=jwt.sign({
                userId:response
            },JWT_SECRET);

            res.status(200).cookie("token",token,{ httpOnly: false, secure: true, sameSite: "none" }).json({
                message:"Logged In!"
            });
        }catch(e){
            console.log(e);
            res.status(401).json({
                message:"Error!"
            })

        }
    }else{
        res.status(401).json({
            message:"No permission"
        })
        return;
    }
})

router.get("/user",authMiddleWare,async (req,res)=>{
    const token=req.cookies.token;
    const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload;
    try{
        const response=await prisma.user.findUnique({
            where:{
                email:decoded.userId.email,
            }
        })
        if(!response){
            res.status(401).json({
                message:"Not Found!"
            })
            return;
        }
        res.status(200).json({
            email:response.email,
            id:response.id,
            name:response.name
            }
        )
    }catch(e){
        console.log(e)
        res.status(401).json({
            message:"Not Found!"
        })
    }
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").json({
        message:"Logged Out!"
    });
})

export default router;