"use client"

import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import { useSocket } from '../../context/SocketProvider';
import { groupIdAtom } from '../Chats';
import { VscChromeClose } from "react-icons/vsc";
import { removeSpaces } from '../../utils/StringMan';


interface PopUpProps{
    trigger:any,
    visible:any,
    prefix:string,
    
}

type FormValues={
    name:string,
}


export const FilePopUp=({trigger,visible,prefix}:PopUpProps)=>{
     if(!visible) return (<div></div>);

    const groupId=useRecoilValue(groupIdAtom);
    const {sendMessage}=useSocket();
    const form=useForm<FormValues>();
    const [success1,setSuccess]=useState<boolean>(false)
    const {register, handleSubmit, formState}=form;
    const {errors}=formState;
    const [loading,setLoading]=useState<boolean>(false)
    const [failure,setFailure]=useState<boolean>(false);
    
    
    axios.defaults.withCredentials = true

    useEffect(()=>{
        setLoading(false)
        setSuccess(false)
        setFailure(false)
    },[])

    const onSubmit=async (data:FormValues)=>{
        setLoading(true)
        
        try{
            const newName=await removeSpaces(data.name)
            const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/createFolder",{
                key:prefix+newName+"/",
                
            })
            if(response){
                setFailure(false)
                setLoading(false)
                setSuccess(true);
                sendMessage({category:"message",grpId:groupId,msg:`Folder ${prefix+newName} Created`})
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
            <div className="bg-[#202d33] p-2 rounded ">
            <VscChromeClose onClick={()=>{trigger(false)}} className='w-5 h-5 text-slate-400 hover:text-slate-100'/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='m-3'>
                <label htmlFor="name" className="text-lg text-slate-400 font-medium mx-1">Name of the folder</label>
                <input type="text" id="name" placeholder='Name' {...register("name",{
                    required:"Name is required"
                })} className="w-full border-2 border-slate-500	rounded-xl p-4 mt-2 mb-2 bg-transparent"/>
                <p className="text-sm text-red-600 mb-3">{errors.name?.message}</p>


                </div>
                <button className="active:scale-[.98] active-duration-75 w-1/5 transition-all p-3 mb-3 rounded-xl bg-slate-700 text-white hover:bg-[#222f35] mx-2"><input type="submit" value="Create" className="active:scale-[.98] active-duration-75 transition-all rounded-xl"/></button>  

            </form>
            {loading && <h3 className="text-slate-400 text-lg font-medium">Creating...</h3>}
            {success1 && <h3 className="text-slate-400 text-lg font-medium">Folder created successfully</h3>}
            {failure && <h3 className="text-slate-400 text-lg font-medium">Failed (try renaming your folder)</h3>}
            </div>
        </div>

   )
}   

export default FilePopUp
