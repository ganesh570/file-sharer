"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { useSocket } from "../../context/SocketProvider"; 
import { groupIdAtom } from "../Chats"; 
import { VscChromeClose } from "react-icons/vsc";
import { removeSpaces } from "../../utils/StringMan"; 


interface PopUpProps{
    trigger:any,
    visible:any,
    prefix:string,

}

async function uploadToS3(e:any,prefix:string,file:any){
    
    try{
      const newName=await removeSpaces(file.name)
      const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/putObject",{
        location:prefix+newName,
      })
      if(response){
        const result = await axios.put(response.data.url,file,{
          headers: { "Content-Type": file.type },})
        
        if(result){
            const preName=prefix+newName
            return {result,preName}
        }
      }
    }catch(e){
      console.log(e)
      return null;
    }
    
    
  }

const UploadPopUp=({trigger,visible,prefix}:PopUpProps)=>{
    
    if(!visible) return (<div></div>);

    const groupId=useRecoilValue(groupIdAtom);
    const {sendMessage}=useSocket();
    const [success1,setSuccess]=useState<boolean>(false)
    const [loading,setLoading]=useState<boolean>(false);
    const [file,setFile]=useState<any>();
    const [failure,setFailure]=useState<boolean>(false);
    axios.defaults.withCredentials = true
    
    useEffect(()=>{
        setSuccess(false)
        setLoading(false)
        setFailure(false)
    },[])

    const handleChange=async (event:any)=>{
        if(!event.target.files) return null
        setFile(event.target.files);
    }

    const onSubmit=async (event:any)=>{
        event.preventDefault()
        setLoading(true);
        console.log(file)
        const uploadArray:any[]=[]
        for(let i=0;i<file.length;i++){
            uploadArray.push(uploadToS3(event,prefix,file[i]))
        }
        Promise.all(uploadArray).then((resolvedArray)=>{
          setLoading(false)
          setFailure(false)
          setSuccess(true);
          resolvedArray.map((key:any)=>{
              sendMessage({category:"message",grpId:groupId,msg:`File ${key.preName} Uploaded`})
          })
          sendMessage({category:"success",grpId:groupId})
        }).catch(()=>{
          setSuccess(false);
          setLoading(false);
          setFailure(true);
        })
        
    }
   return (

            <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-[#202d33] p-2 rounded ">
            <VscChromeClose onClick={()=>{trigger(false)}} className='w-5 h-5 text-slate-400 hover:text-slate-100'/>
            <form onSubmit={onSubmit}>
                <div className='m-3'>
                <label htmlFor="file" className="text-lg text-slate-400 font-medium mx-1">Upload file(s)
                <input type="file" id="file" name="file" multiple className="w-full rounded-xl p-4 mt-2 mb-2 bg-transparent" onChange={handleChange}/>
                </label>
                </div>
                <button type="submit" className="active:scale-[.98] active-duration-75 w-1/5 transition-all p-3 mb-3 rounded-xl bg-slate-700 text-white hover:bg-[#222f35] mx-2">Upload</button>  

            </form>
            {loading && <h3 className="text-slate-400 text-lg font-medium">Uploading...</h3>}
            {success1 && <h3 className="text-slate-400 text-lg font-medium">File uploaded successfully</h3>}
            {failure && <h3 className="text-slate-400 text-lg font-medium">Failed (Try renaming your file)</h3>}
            
            </div>
            </div>
   )
}

export default UploadPopUp