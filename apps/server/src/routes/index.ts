import express from "express"
import userRouter from "./user"
import authRouter from "./auth"
import objRouter from "./object"

const router=express.Router()

router.use("/user",userRouter)
router.use("/auth",authRouter)
router.use("/object",objRouter)

export default router;