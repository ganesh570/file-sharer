"use client"

import {useState,useEffect,useCallback,useContext} from "react"
import {Socket,io} from "socket.io-client"
import React from 'react';
import { useCookies } from "react-cookie";

interface sendMessageProps{
    category:string,
    grpId:number|null,
    msg?:string
    
}
interface SocketProviderProps{
    children?:React.ReactNode;
}

export interface ISocketContext{
    sendMessage:({category,grpId,msg}:sendMessageProps)=>void;
    messages:string[];
    setMessages:(message:string[])=>void,
    success:number,
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{
    const [socket,setSocket]=useState<Socket>();
    const [messages,setMessages]=useState<string[]>([])
    const [cookies, setCookie] = useCookies(["CLIENT_TOKEN"]);
    const [success,setSuccess]=useState<number>(1);
    console.log("SocketProvider")
    console.log(cookies)
    const sendMessage:ISocketContext["sendMessage"]=useCallback(({category,grpId,msg})=>{
        
        if(socket){
            if(category==="message"){
                socket.emit("message",{message:msg,grpId:grpId})
            }
            if(category==="join-group"){
                socket.emit("join-group",grpId)
            }
            if(category==="success"){
                socket.emit("success",{message:"hello",grpId:grpId})
            }
        }

    },[socket])

    const onMessageRec=useCallback(async (msg:string)=>{
        setMessages((prev)=>[...prev,msg])
    },[])

    const onSuccess=useCallback(async (msg:string)=>{
        setSuccess(s=>s+1);
    },[])

    useEffect(()=>{
        const _socket=io(process.env.NEXT_PUBLIC_BACKEND!,{
            auth: {
              cookie:cookies.CLIENT_TOKEN
            }
          });
        _socket.on("message",onMessageRec);
        _socket.on("success",onSuccess)

        setSocket(_socket);

        return ()=>{
            _socket.off()
            _socket.disconnect();
            setSocket(undefined)
        }
    },[cookies])

    return (
        <SocketContext.Provider value={{sendMessage,messages,setMessages,success}}>
            {children}
        </SocketContext.Provider>
    )
    

}

