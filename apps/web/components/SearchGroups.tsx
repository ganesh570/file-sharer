"use client"

import { useState } from "react";
import useUser from "../context/UseUser"
import axios from "axios";
import { useSocket } from "../context/SocketProvider";

interface SearchGroupProps{
    id:number,
    name:string,
}

axios.defaults.withCredentials = true

const SearchGroups=({id,name}:SearchGroupProps)=>{
    const {user}=useUser(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/auth/user");
    const {sendMessage}=useSocket();
    const [success,setSuccess]=useState<boolean>(false)
    axios.defaults.withCredentials = true
    return (
        <div className="flex justify-between my-1 scroll-auto overflow-y-auto">
            <div>
                <h3 className="text-white font-semibold text-md">{name}</h3>
            </div>
            <div>
                <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={async ()=>{
                    try{
                        console.log("join inside")
                        axios.defaults.withCredentials = true
                        const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/auth/user",{
                            groupId:id
                        })
                        if(response){
                            setSuccess(true);
                            sendMessage({category:"join-group",grpId:id})
                            sendMessage({category:"message",grpId:id,msg:`${user?.name} joined the group`});
                        }
                    }catch(e){
                        console.log(e)        
                    }          
                }}>Join</button>
            </div>
        </div>
    )
}

export default SearchGroups;