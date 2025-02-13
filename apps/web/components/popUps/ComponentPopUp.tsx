"use client"

import { atom } from 'recoil';
import { useState } from 'react';
import { VscChromeClose } from "react-icons/vsc";

interface PopUpProps{
    trigger:any,
    visible:any,
    source:string,
    contentType:string
}

export const successAtom11=atom({
    key:"successAtom11",
    default:null as boolean|null
})

export const ComponentPopUp=({trigger,visible,source,contentType}:PopUpProps)=>{
    if(!visible) return (<div></div>);
    const [maxWidth,setMaxWidth]=useState<number>(500)
    const [maxHeight,setMaxHeight]=useState<number>(500)
    const [imageDim, setImageDim] =useState({ width: 'auto', height: 'auto' });
    const [videoSize, setVideoSize] = useState({width: 'auto',  height: 'auto'});

    const handleImageLoad = (event:any) => {
        
        const { naturalWidth, naturalHeight } = event.target;
        if (naturalWidth > maxWidth) {
            setImageDim({
              width: maxWidth.toString(),
              height: maxHeight.toString()
        });
          } else {
            setImageDim({
              width: naturalWidth,
              height: naturalHeight
            });
          }
      };

      const handleVideoMetadata = (event:any) => {
        const { videoWidth, videoHeight } = event.target;
        
        let widthV = videoWidth;
        let heightV = videoHeight;
        const ratio =  widthV/heightV;
        if (heightV > maxHeight) {
          ratio<1?heightV = Math.round(heightV * ratio):heightV = Math.round(heightV * (1/ratio));
        } 
        if(widthV>maxWidth){
            ratio<1?widthV = Math.round(widthV * ratio):widthV = Math.round(widthV * (1/ratio));
        }
        setVideoSize({ width:widthV.toString(), height:heightV.toString() });
    };
    
   return (

    
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-[#202d33] p-2 rounded ">
              <VscChromeClose onClick={()=>{trigger(false)}} className='w-5 h-5 text-slate-400 hover:text-slate-100'/>
              {contentType==="image/jpeg"||contentType==="image/png"?<img src={source} height={imageDim.height} width={imageDim.width} onLoad={handleImageLoad}/>:<div></div>}
              {contentType==="video/mp4"||contentType==="video/avi"?<video controls height={videoSize.height} width={videoSize.width} onLoadedMetadata={handleVideoMetadata}>
              <source src={source} type={contentType} height={videoSize.height} width={videoSize.width}/>
              </video>:<div></div>}
              {contentType==="application/pdf"?<embed src={source} width="1280" height="720" 
              type={contentType}></embed>:<div></div>}
              {contentType==="audio/mp3"||contentType==="mp3"?<audio controls><source src={source} type="audio/mp3"/></audio>:<div></div>}
              {contentType==="audio/mpeg"||contentType==="mpeg"?<audio controls><source src={source} type="audio/mpeg"/></audio>:<div></div>}
            </div>    
        </div>

   )
}   

export default ComponentPopUp
