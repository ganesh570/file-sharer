"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { groupIdAtom } from "./Chats";
import { DatesMan } from "../utils/StringMan";

interface redunProps{
  id:number,
  userId:number,
  groupId:number,
  createdAt:string,
  content:string,
  client_offset:number|null
}

const Logs=()=>{
    
    const groupId=useRecoilValue(groupIdAtom);
    const [redun,setRedun]=useState<redunProps[]>();
    const {messages,setMessages}=useSocket();
    const [loading,setLoading]=useState<boolean>(false);
    useEffect(()=>{
      setLoading(false)
    })

    useEffect(()=>{
      setRedun([]);
      setMessages([])
      setLoading(true);
        async function MesFunction(){
          try{
            const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/user/retrieve",{
              groupId:groupId
            })
            if(response){
              setRedun(response.data.response)
              setLoading(false)
            }
          }catch(e){
            setLoading(false)
            console.log(e)
          }
        }
      MesFunction();
    },[groupId])
    
    
    return (
    <div>
      <div className="flex flex-col m-3">
        
        {redun?.map((e) => ( 
          <li className="text-gray-300 px-1 font-semibold" key={e.content+DatesMan(e.createdAt)+Math.random().toString()}> {e.content}, {DatesMan(e.createdAt)}</li>
        ))}
        {messages?.map((e) => (
          <li className="text-gray-300 px-1 font-semibold" key={e+Math.random().toString()}>{e}</li>
        ))}
        {loading && <div className="font-bold text-xl text-white">Loading...</div>}
      </div>
    </div>
    )
}

export default Logs 