"use client"

import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../../context/SocketProvider';
import { groupIdAtom } from '../Chats';
import { VscChromeClose } from "react-icons/vsc";
import { delAtom } from '../FolderBox';


interface PopUpProps{
    trigger:any,
    visible:any,
    prefix:string,

}


export const DeletePopUp=({trigger,visible,prefix}:PopUpProps)=>{
    if(!visible) return (<div></div>);

    const groupId=useRecoilValue(groupIdAtom);
    const [del,setDel]=useRecoilState(delAtom)
    const {sendMessage}=useSocket();
    const [success1,setSuccess]=useState<boolean>(false)
    const [loading,setLoading]=useState<boolean>(false)
    const [failure,setFailure]=useState<boolean>(false);
    axios.defaults.withCredentials = true

    useEffect(()=>{
        setLoading(false)
        setSuccess(false)
        setFailure(false)
    },[])

    const onSubmit=async ()=>{
        setLoading(true)
        
        try{
            
            const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/deleteObject",{
                key:prefix+del
            })
            if(response){
                setLoading(false)
                setFailure(false)
                setSuccess(true);
                setDel("")
                sendMessage({category:"message",grpId:groupId,msg:`File ${prefix+del} Deleted`})
                sendMessage({category:"success",grpId:groupId})
            }else{
                console.log("error")
            }
        }catch(e){
            setSuccess(false);
            setLoading(false)
            setFailure(true)
            console.log(e)
        }
    }

   return (

    
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="flex flex-col bg-[#202d33] p-2 rounded ">
            <VscChromeClose onClick={()=>{trigger(false)}} className='w-5 h-5 text-slate-400 hover:text-slate-100'/>
            <div>
            <h3 className='text-gray-300 font-semibold text-xl m-5'>Do you want to delete {prefix+del}?</h3>
            </div>
            <div className='flex flex-row m-5'>
                <button onClick={onSubmit} className='text-gray-300 font-semibold text-lg mt-3 mr-5 bg-slate-700 px-5 py-2 rounded-md hover:bg-slate-500'>Yes</button>
                <button onClick={()=>{trigger(false)}} className='text-gray-300 font-semibold text-lg mt-3 mr-5 bg-slate-700 px-5 py-2 rounded-md hover:bg-slate-500'>No</button>
            </div>
            {loading && <h3 className="text-slate-400 text-lg font-medium">Deleting...</h3>}
            {success1 && <h3 className="text-slate-400 text-lg font-medium">File Deleted successfully</h3>}
            {failure && <h3 className="text-slate-400 text-lg font-medium">Failed (try again)</h3>}
            </div>
        </div>

   )
}   

export default DeletePopUp
