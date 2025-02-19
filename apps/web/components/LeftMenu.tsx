"use client"

import dynamic from "next/dynamic";
import {useState} from "react"
import RoundedBtn from "./buttons/RoundedBtn";
const Chats = dynamic(
    () => import('./Chats'),
    { ssr: false } // Disable server-side rendering
  );
import axios from "axios"
import { FaPlus } from "react-icons/fa";
const PopUp = dynamic(
    () => import('./popUps/PopUp'),
    { ssr: false } // Disable server-side rendering
  );
import { LuDoorOpen } from "react-icons/lu";
const JoinPopUp = dynamic(
    () => import('./popUps/JoinPopUp'),
    { ssr: false } // Disable server-side rendering
  );
import { IoIosLogOut } from "react-icons/io";
import UseUser from "../context/UseUser";
import { useRouter } from 'next/navigation'


const LeftMenu=()=>{
    const router=useRouter()
    const {user}=UseUser(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/auth/user"); 
    const [popUp,setPopUp]=useState<boolean>(false);
    const [popUp2,setPopUp2]=useState<boolean>(false);
    const hanOnClose= ()=>{setPopUp(false)}
    const hanOnClose2= ()=>{setPopUp2(false)}

    return (
        <div className="flex flex-col border-r border-neutral-700 w-100 h-screen">
            <div className="flex justify-between items-center bg-[#202d33] h-[60px] p-3">
            <div className="rounded-full h-12 w-12 bg-gray-500 flex justify-center mb-1 mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user?user.name[0]?.toUpperCase():""}
                </div>
            </div>

                <div className="flex justify-between w-[175px]  ">
                
            
                     <RoundedBtn className="text-white size-5" icon={<FaPlus/>} onClick={async ()=>{
                            setPopUp(true)
                     }}/>
                     <RoundedBtn className="text-white size-5" icon={<LuDoorOpen/>} onClick={()=>{
                            setPopUp2(true)
                     }}/>
                      <RoundedBtn className="text-white size-5" icon={<IoIosLogOut/>} onClick={async ()=>{
                            try{
                                const response=await axios.get(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/auth/logout");
                                if(response){
                                    router.push("/signin");
                                }
                            }catch(e){
                                console.log(e)
                            }
                            
                     }}/>
                    
                     
                </div>
                </div>
            <div className="border border-gray-700">
                <Chats/>
            </div>


        <PopUp trigger={hanOnClose} visible={popUp}/>
        <JoinPopUp trigger={hanOnClose2} visible={popUp2}/> 
        </div>

    )

}

export default LeftMenu