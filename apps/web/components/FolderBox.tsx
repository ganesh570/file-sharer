"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from "react"
import axios from "axios"
import {subString,lastWord, removeString } from "../utils/StringMan"
import {atom, useRecoilState, useRecoilValue } from "recoil";
import { IoMdArrowRoundBack } from "react-icons/io";
import RoundedBtn from "./buttons/RoundedBtn";
import { groupIdAtom } from "@/components/Chats";
import { useSocket } from "../context/SocketProvider";
import { IoMdRefresh } from "react-icons/io";

const UploadPopUp = dynamic(
    () => import('./popUps/UploadPopUp'),
    { ssr: false } 
  );

  const FilePopUp = dynamic(
    () => import('./popUps/FilePopUp'),
    { ssr: false } 
  );

 
const DeletePopUp = dynamic(
  () => import('./popUps/DeletePopUp'),
  { ssr: false } 
  
);
const ComponentPopUp = dynamic(
  () => import('./popUps/ComponentPopUp'),
  { ssr: false } 
  
);



interface Folders{
    folName:string
}

interface Files{
    fileName:string
    key:any
}

export const delAtom=atom({
    key:"delAtom",
    default:"" as string
})

const FolderBox=()=>{
    const groupId=useRecoilValue(groupIdAtom)
    const [refresh,setRefresh]=useState<boolean>(false);
    const [arr1,setArr1]=useState<Folders[]>();
    const [arr2,setArr2]=useState<Files[]>();
    const [del,setDel]=useRecoilState(delAtom)
    const [prefix,setPrefix]=useState<string>("group-"+groupId+"/");
    const [popUp,setPopUp]=useState<boolean>(false);
    const [popUp2,setPopUp2]=useState<boolean>(false);
    const [popUp3,setPopUp3]=useState<boolean>(false);
    const [popUp1,setPopUp1]=useState<boolean>(false);
    const [source,setSource]=useState<string>("")
    const [contentType,setContentType]=useState<string>("")
    axios.defaults.withCredentials = true
    const {success}=useSocket();
    const hanOnClose= ()=>{setPopUp(false)}
    const hanOnClose2=()=>{setPopUp2(false)};
    const hanOnClose3=()=>{setPopUp3(false)};
    const hanOnClose1=()=>{setPopUp1(false)};

    useEffect(()=>{
        setPrefix("group-"+groupId+"/")
        const getList=async ()=>{
            try{
                const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/getList",{
                    prefix:"group-"+groupId+"/",
                    delimiter:'/'
                })
                if(response){
                    const arr1:Folders[]=response.data.folders?.map((element:any)=>{
                        const fol={
                            folName:lastWord(element.Prefix,"folder")
                        }
                        return fol;
                    })
                 
                    const arr2:Files[]=response.data.files?.map((element:any)=>{
                        const fil={
                            fileName:lastWord(element.Key,"file")
                        }
                        return fil;
                    })
                    setArr1(arr1)
                    setArr2(arr2)
                }else{
                    return new Error("Error")
                }
            }catch(e){
                console.log(e)
            }
        }
        getList();
        
    },[groupId])


    useEffect(()=>{
        const getList=async ()=>{
            try{
                const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/getList",{
                    prefix:prefix,
                    delimiter:'/'
                })
                if(response){
                    const arr1:Folders[]=response.data.folders?.map((element:any)=>{
                        const fol={
                            folName:lastWord(element.Prefix,"folder")
                        }
                        return fol;
                    })
                  
                    const arr2:Files[]=response.data.files?.map((element:any)=>{
                        const fil={
                            fileName:lastWord(element.Key,"file")
                        }
                        return fil;
                    })
                    
                    setArr1(arr1)
                    setArr2(arr2)
                    
                }else{
                    return new Error("Error")
                }
            }catch(e){
                console.log(e)
            }
        }
        getList();
        
    },[success,refresh])

    const fileHandler=async (fileName:string)=>{
        setPrefix(prefix+fileName)
        try{
            const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/getObject",{
                location:prefix+fileName
            })
            if(response){
                if(response.data.type===1){
                    setPopUp3(true);
                    setSource(response.data.url)
                    setContentType(response.data.contentType)
                }else{
                    window.open(response.data.url,'_blank')?.focus()
                }
            }
            setPrefix(subString(prefix+"/"))
        }catch(e){
            console.log(e)
        }
    }
    
    const folderHandler=async (pre:string|undefined)=>{
        setPrefix(prefix+pre+"/")
        try{
            const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/getList",{
                prefix:prefix+pre+'/',
                delimiter:'/'
            })
            if(response){
                const arr1:Folders[]=response.data.folders?.map((element:any)=>{
                    const fol={
                        folName:lastWord(element.Prefix,"folder")
                    }
                    return fol;
                })
                
                const arr2:Files[]=response.data.files?.map((element:any)=>{
                    const fil={
                        fileName:lastWord(element.Key,"file")
                    }
                    return fil;
                })
              
                setArr1(arr1)
                setArr2(arr2)    
            }else{
                return new Error("Error")
            }
        }catch(e){
            console.log(e)
        }
    } 

    const backHandler=async (pre:string)=>{
        setPrefix(pre);
        try{
            const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/object/getList",{
                prefix:pre,
                delimiter:"/"
            })
            if(response){
                const arr1:Folders[]=response.data.folders?.map((element:any)=>{
                    const fol={
                        folName:lastWord(element.Prefix,"folder")
                    }
                    return fol;
                })
                
                const arr2:Files[]=response.data.files?.map((element:any)=>{
                    const fil={
                        fileName:lastWord(element.Key,"file")
                    }
                    return fil;
                })
                setArr1(arr1)
                setArr2(arr2)
                
            }else{
                return new Error("Error")
            }

        }catch(e){
            console.log(e)
        }
    }




    return(
        <div className="flex flex-col">
            <div className="flex flex-row m-3">
                <RoundedBtn icon={<IoMdArrowRoundBack/>} className="mx-3 text-white font-semibold" onClick={async ()=>{
                    const str=removeString(prefix)
                    if(str=="-1") return;
                    await backHandler(str);
                }}/>
                <RoundedBtn icon={<IoMdRefresh />} className="mx-3 text-white font-semibold" onClick={async ()=>{
                   setRefresh(!refresh)
                }}/>
                <button className="p-2 font-semibold text-white mx-3" onClick={async ()=>{
                     setPopUp(true);
                }}>Add Folder</button>
                <button className="p-2 font-semibold text-white mx-3" onClick={()=>{
                    setPopUp2(true);
                }}>Add File(s)</button>
                <button className="p-2 font-semibold text-white mx-3 disabled:text-gray-600" disabled={del!==""?false:true} onClick={async ()=>{
                     setPopUp1(true)
                }}>Delete File</button>
                
            </div>
            <FilePopUp trigger={hanOnClose} visible={popUp} prefix={prefix}/>
            <UploadPopUp trigger={hanOnClose2} visible={popUp2} prefix={prefix}/>
            <ComponentPopUp trigger={hanOnClose3} visible={popUp3} source={source} contentType={contentType}/>
            <DeletePopUp trigger={hanOnClose1} visible={popUp1} prefix={prefix}/>
            <div className="m-2">
            <h2 className="text-white text-lg px-1 font-semibold my-1">Folders</h2>
            {
                arr1?.map((element)=>(
                    <div key={element.folName+Math.random().toString()}>
                    <button onClick={async ()=>{
                        await folderHandler(element.folName)
                    }} className="flex flex-row text-gray-300 font-semibold border-spacing-2 px-2 hover:text-white">
                        {element.folName}
                    </button>
                    </div>
                ))
            }
            </div>
           <div className="m-2">
           <h2 className="text-white text-lg px-1 font-semibold my-1">Files</h2>
            {
                arr2?.map((element)=>(
                    <div key={element.fileName+Math.random().toString()}> 
                    <button onClick={async ()=>{
                        await fileHandler(element.fileName);
                    }} className={`flex flex-row text-gray-300 font-semibold border-spacing-2 px-2 hover:text-white`} onContextMenu={(e:any)=>{
                        e.preventDefault();
                        setDel(element.fileName);
                    }}>
                        {element.fileName}
                        
                    </button>
                   </div>
                ))  
            }
             
           </div>
        </div>
    )

}

export default FolderBox;