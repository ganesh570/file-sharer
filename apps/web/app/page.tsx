"use client"

import LandingPage from "../pages/LandingPage";
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
//import { useCookies } from "next-client-cookies"
import { useCookies } from "react-cookie";


const ChatApp = dynamic(
  () => import('../pages/ChatApp'),
  { ssr: false } 
);

export default function Home() {
  const cookie=Cookies.get('lawda');
  //const cookies = useCookies();
  const [cookies, setCookie] = useCookies();
  console.log(cookie);
  console.log(cookies);
  if(!cookie){
    return(
        <LandingPage/>
    )
  }
    
  return (
    <ChatApp/>
  );
}
 