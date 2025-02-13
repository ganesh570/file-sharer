"use client"

import LeftMenu from "../components/LeftMenu"
import dynamic from "next/dynamic";
const ChatDetail = dynamic(
    () => import('../components/ChatDetail'),
    { ssr: false } 
  );


const ChatApp=()=>{
    
    
    return(
        <div className="w-screen h-screen overflow-hidden">
            <div className="flex justify-start  items-center bg-[#111a21] h-screen">
                <div className="bg-[#111a21] min-w-[400px] max-w-[500px] w-100 h-100">
                    <LeftMenu/>
                </div>

                <div className="bg-[#222f35] min-w-full max-w-full w-100 h-100">

                     <ChatDetail/>
                </div>
            </div>
        </div>
    )
}

export default ChatApp;