"use client"

import dynamic from "next/dynamic";
const FolderBox = dynamic(
  () => import('./FolderBox'),
  { ssr: false } // Disable server-side rendering
);
import { chatNameAtom } from "./Chats"
import { useRecoilValue } from "recoil"
const Logs = dynamic(
  () => import('./Logs'),
  { ssr: false } // Disable server-side rendering
);


const ChatDetail = () => {
  const name = useRecoilValue(chatNameAtom);
  
  return (
    <div className="flex flex-col h-screen">

      <div className="flex justify-between bg-[#202d33] h-[60px] p-3">
        <div className="flex items-center">
          <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
            <div className="flex flex-col justify-center h-full text-xl">
              {name ? name[0] : ""}
            </div>
          </div>
          
          <div className="flex flex-col mx-2">
            <h1 className="text-white font-semibold text-xl">{name}</h1>
          </div>
        </div>
      </div>

      
      <div className="flex flex-col flex-1 overflow-hidden">
        
        <div className="h-1/2 scroll-auto p-4 overflow-y-auto">
          <FolderBox />
        </div>


        <div className="h-1/2 flex flex-col">
          <h2 className="text-white px-3 font-semibold text-lg">Logs</h2>
          <div className="flex-1 scroll-auto overflow-y-auto bg-[#202d33] m-3">
            <Logs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail