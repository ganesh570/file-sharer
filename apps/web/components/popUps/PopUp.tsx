"use client"

import {useForm} from 'react-hook-form';
import axios from 'axios';
import { useSocket } from '../../context/SocketProvider'; 
import { VscChromeClose } from 'react-icons/vsc';
import { useRecoilState,atom } from 'recoil';
import { useEffect, useState } from 'react';

interface PopUpProps{
    trigger:any,
    visible:any
}

type FormValues={
    name:string,
    descrption:string
}

export const successAtom=atom({
    key:"successAtom",
    default:false as boolean|null
})


const PopUp=({trigger,visible}:PopUpProps)=>{
    if(!visible) return (<div></div>);

    const {sendMessage}=useSocket()
    const form=useForm<FormValues>();
    const [success,setSuccess]=useRecoilState(successAtom);
    const {register, handleSubmit, formState}=form;
    const {errors}=formState;
    axios.defaults.withCredentials = true
    const [loading,setLoading]=useState<boolean>(false);
    const [failed,setFailure]=useState<boolean>(false);

    useEffect(()=>{
        setSuccess(false)
        setFailure(false)
        setLoading(false)
    })

    const onSubmit=async (data:FormValues)=>{
        setLoading(true)
        try{
            const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/user/create_grp",{
                name:data.name,
                description:data.descrption
            })
            if(response){
                setLoading(false)
                setFailure(false)
                setSuccess(true)
                sendMessage({category:"message",grpId:response.data.id,msg:`Group with ${data.name} created`})
            }
        }catch(e){
            setLoading(false)
            setSuccess(false)
            setFailure(true)
            console.log(e);
        }
    }
   return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-[#202d33] p-2 rounded ">
            <VscChromeClose onClick={()=>{trigger(false)}} className='w-5 h-5 text-slate-400 hover:text-slate-100'/>
            <h3 className=" flex flex-col justify-center text-slate-400 text-xl font-semibold items-center">Create group</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="m-3">
                    <label htmlFor="name" className="text-lg text-slate-400 font-medium mx-1">Name of the group</label>
                    <input type="text" id="name" placeholder='Name' {...register("name",{
                        required:"Name is required"
                    })} className="w-full border-2 border-slate-500	rounded-xl p-4 mt-2 mb-2 bg-transparent"/>
                    <p className="text-sm text-red-600 mb-3">{errors.name?.message}</p>
                </div>
                <div className="m-3">
                    <label htmlFor="descrption" className="text-lg text-slate-400 font-medium mx-1">Description of  the group</label>
                    <input type="text" id="descrption" placeholder='Description' {...register("descrption",{
                        required:"Description is required"
                    })} className="w-full border-2 border-slate-500	rounded-xl p-4 mt-2 mb-2 bg-transparent"/>
                    <p className="text-sm text-red-600 mb-3">{errors.descrption?.message}</p>
                </div>
                
                <button className="active:scale-[.98] active-duration-75 w-1/5 transition-all p-3 mb-3 rounded-xl bg-slate-700 text-white hover:bg-[#222f35] mx-2"><input type="submit" value="Create" className="active:scale-[.98] active-duration-75 transition-all rounded-xl"/></button>  
            </form>
            {loading && <h3 className="text-slate-400 text-lg font-medium">Creating...</h3>}
            {success && <h3 className="text-slate-400 text-lg font-medium">Group created successfully</h3>}
            {failed && <h3 className="text-slate-400 text-lg font-medium">Failed (Try Again)</h3>}
            </div>
            
            
        </div>
         
   )
}   

export default PopUp;