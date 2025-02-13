"use client"

import Cookies from 'js-cookie';
import LandingPage from "../pages/LandingPage";
import dynamic from 'next/dynamic';
const ChatApp = dynamic(
  () => import('../pages/ChatApp'),
  { ssr: false } 
);

export default function Home() {
  const cookie=Cookies.get('token');
  if(!cookie){
    return(
        <LandingPage/>
    )
  }
    
  return (
    
    <ChatApp/>
  );
}
 