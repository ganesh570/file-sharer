"use client"

import {useState} from "react"
import {useForm} from 'react-hook-form';
import axios from "axios";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Cookies from 'js-cookie';

type SignInProps={
  email:string,
  password:string
}

const SignIn=()=>{
  const router=useRouter()
  const form=useForm<SignInProps>();
  const {register, handleSubmit, formState}=form;
  const [error,setError]=useState<boolean>(false)
  const {errors}=formState;
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use(
    (config) => {
      config.withCredentials = true
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  const onSubmit=async (data:SignInProps)=>{
      try{
        const response=await axios.post(process.env.NEXT_PUBLIC_BACKEND!+"/api/v1/auth/signin",data);
        if(response){
          router.push("/");
        }else{
          setError(true)
          return;
        }
      }catch(e){
        console.log(e)
        setError(true)
        return;
      }

  }
    return (
      <main className="flex w-screen h-screen">
      <div className="w-full flex items-center justify-center mg:w-1/2">
        <div className="flex flex-col bg-gray-300 p-7 w-2/5 border-2 rounded-xl">
        <h1 className="text-5xl font-semibold">Welcome Back!</h1>
         <p className="font-medium text-lg text-gray-600 mt-4">Please enter your details.</p>
          <div className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col'>
                <label htmlFor="email" className="text-lg font-medium">Email</label>
                <input type="text" id="email" placeholder='Email' {...register("email",{
                    required:"Email is required",
                    
                })} className="w-full border-2 border-slate-700	 rounded-xl p-4 mt-2 mb-2 bg-transparent"/>
                <p className="text-md text-red-600 mb-3 p-1">{errors.email?.message}</p>
              </div>
              <div className="flex flex-col">
                <label htmlFor="password"  className="text-lg font-medium">Password</label>
                <input type="password" id="password" placeholder='Password' {...register("password",{
                    required:"Password is required (Minimum 6 letters)"
                })} className="w-full border-2 border-slate-700 rounded-xl p-4 mt-2 mb-2 bg-transparent"/>
                <p className="text-md text-red-600 mb-10 p-1">{errors.password?.message}</p>
              </div>
            
              <div className="flex flex-col mb-5 justify-center items-center">
            <button className="active:scale-[.98] active-duration-75 w-2/5 transition-all p-3 mb-3 rounded-xl bg-black text-white hover:bg-[#222f35] "><input type="submit" value="Submit" className="active:scale-[.98] active-duration-75 transition-all rounded-xl"/></button>  
            </div>
          </form>
          {error && <p className="text-md text-red-600 mb-1 p-1">Error in signing in</p>}
          <div className="flex">
             <p className="px-1"> New here?</p>
              <Link href="/signup" className="text-blue-500 underline">Sign up</Link>
          </div>
          </div>
        </div>
      </div>
      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-[#111a21] to-[#222f35] rounded-full">
          <div className="w-full h-1/2 absolute bottom-0 bg-white/10 "/>
        </div>
      </div>
  </main>

    )
}

export default SignIn;