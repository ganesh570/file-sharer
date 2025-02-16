"use client"

import LandingPage from "../pages/LandingPage";
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';

const ChatApp = dynamic(
  () => import('../pages/ChatApp'),
  { ssr: false } 
);

export default function Home() {
  const cookie=Cookies.get('token');
  console.log(cookie)
  if(!cookie){
    return(
        <LandingPage/>
    )
  }
    
  return (
    <ChatApp/>
  );
}
 