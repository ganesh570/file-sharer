"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { VscChromeClose } from 'react-icons/vsc';
import SearchGroups from '../SearchGroups';

interface PopUpProps{
    trigger:any,
    visible:any
}


interface groupValues{
    id:number,
    name:string,
    description:string

}

const JoinPopUp=({trigger,visible}:PopUpProps)=>{
    if(!visible) return (<div></div>);

    
    const [filter,setFilter]=useState<string>("")
    const [groups,setGroups]=useState<groupValues[]>([])
    const [loading,setLoading]=useState<boolean>(false);
    const [failed,setFailure]=useState<boolean>(false);
    axios.defaults.withCredentials = true

    useEffect(()=>{
        setFailure(false)
        setLoading(false)
    })

    useEffect(()=>{
        const onSubmit=async ()=>{
            setLoading(true)
            try{
                 const response=await axios.get(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/user/search?filter="+filter)
                 if(response){
                    setLoading(false)
                    setFailure(false)
                     setGroups(response.data);
                 }else{
                     throw new Error("Error")
                 }
            }catch(e){
                setLoading(false)
                setFailure(true)
             console.log(e);
            }
         }
         onSubmit();
    },[filter])

   return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-[#202d33] p-2 rounded ">
            <VscChromeClose onClick={()=>{trigger(false)}} className='w-5 h-5 text-slate-400 hover:text-slate-100'/>
            <h3 className=" flex flex-col justify-center text-slate-400 text-xl font-semibold items-center">Join a group</h3>

                <div className="m-3">
                    <label className="text-lg text-slate-400 font-medium mx-1">Name of the group</label>
                    <input type="text" id="name" placeholder='Name' onChange={(e)=>{
                        setFilter(e.target.value)
                    }} className="w-full border-2 border-slate-500	rounded-xl p-4 mt-2 mb-2 bg-transparent"/>
                
                </div>
                <div className='flex flex-col scroll-auto overflow-y-auto'>
                   {
                     groups.map((group)=>(
                        <li className='flex flex-col justify-between my-1 scroll-auto overflow-y-auto' key={group.id}> 
                        <SearchGroups key={group.id} id={group.id} name={group.name}/>
                        </li>
                     ))
                   }
                </div>
                {loading && <h3 className="text-slate-400 text-lg font-medium">Loading...</h3>}
                {failed && <h3 className="text-slate-400 text-lg font-medium">Failed (Try Again)</h3>}
            </div>
        </div>

    )
}

export default JoinPopUp;