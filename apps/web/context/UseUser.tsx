"use client"

import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export interface UserProps{
    email:string,
    id:number,
    name:string
}

const UseUser=(url:string)=>{
    axios.defaults.withCredentials = true
    const [user,setUser]=useState<UserProps>();
    const [loading,setLoading]=useState<boolean>(true)
    const [error,setError]=useState()
    
    useEffect(()=>{
    const setUsr=async ()=>{
        try{
            const response=await axios.get(url);
            if(response){
                setUser(response.data)
            }else{
                return new Error("No user obtained");
            }
        }catch(e){
            console.log(e)
            setError(error);
        }finally{
            setLoading(false)
        }
        
    }

    setUsr();
},[url])


    return {user,loading,error};
}


export default UseUser;