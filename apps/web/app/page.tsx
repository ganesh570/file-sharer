"use client"

import LandingPage from "../pages/LandingPage";
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';

const ChatApp = dynamic(
  () => import('../pages/ChatApp'),
  { ssr: false } 
);

export default function Home() {
  const cookies = Cookies.get('token');
  if(!cookies){
    return(
        <LandingPage/>
    )
  }
    
  return (
    <ChatApp/>
  );
}
 