"use client"

import { successAtom } from "./popUps/PopUp";
import {useState,useEffect} from "react";
import Group from "./Group"
import axios from "axios";
import { atom, useRecoilState, useRecoilValue} from "recoil";
import { useSocket } from "../context/SocketProvider";
import UseUser from "../context/UseUser";

export const groupIdAtom=atom({
    key:"groupIdAtom",
    default:null as number|null
})

export const chatDetailAtom=atom({
  key:"chatDetailAtom",
  default:false as boolean
})

export const chatNameAtom=atom({
  key:"chatNameAtom",
  default:null as null|string
})

interface GroupProps{
    id:number,
    name:string,
    description:string
}

const Chats=()=>{
    
    const success=useRecoilValue(successAtom)
    const {sendMessage}=useSocket();
    const {user}=UseUser(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/auth/user");
    const [groups,setGroups]=useState<GroupProps[]>([])
    const [groupId,setGroupId]=useRecoilState(groupIdAtom)
    const [name,setName]=useRecoilState(chatNameAtom)
    const [chatDetail,setChatDetail]=useRecoilState<boolean>(chatDetailAtom)
    const [load,setLoad]=useState<boolean>(false)
    axios.defaults.withCredentials = true

    useEffect(()=>{
      setLoad(false)
    },[])

    useEffect(()=>{
      setLoad(true)
        async function getGroups(){
          try{
            if(user){
                const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/user/get_groups",{
                    
                  id:user?.id,
                })  
                if(response){
                    setGroups(response.data.result)
                    setLoad(false);
                }
            }
          }catch(e){
            console.log(e);
          }
        }
        
        getGroups();
    },[success,user])

    if(load){
      return (
        <div className="flex flex-row text-white text-xl font-semibold mx-3 my-3">Loading...</div>
      )
    }

    return (
      
      <div className="flex flex-col scroll-auto overflow-y-scroll cursor-pointer h-100">
      {groups.length==0? <div className="text-white m-5 font-semibold">
        Click on the plus icon to create a group or the door icon to join a group</div>:
       groups?.map((group) => {
        return (
         <li className="flex flex-col" key={group.id}>
          <Group
            name={group.name}
            onClick={()=>{
                setGroupId(group.id)
                setName(group.name)
                setChatDetail(true);
                sendMessage({category:"join-group", grpId:group.id})
            }}
          />
        </li>
        );
      })} 
      
    </div>
    )

}

export default Chats