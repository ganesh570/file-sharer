import Image from "next/image";
import Link from "next/link";

const LandingBar=()=>{
    return (
        <nav className="p-2 bg-transparent flex items-center justify-between">
               <Link href="/" className="flex items-center">
                 <div className="relative h-8 w-8 mr-4">
                     <Image fill alt="Logo" src="/icon.svg"/>
                 </div>
                 <h1 className="text-3xl font-bold text-white">
                         File Sharer
                 </h1>
               </Link>
               <div className="flex items-center gap-x-2">
                     <Link href={"/signup"}>
                         <button className=" text-white bg-blue-900 p-4 text-md rounded-full">
                             Get Started
                         </button>
                     </Link>
               </div>
        </nav>
     )
}

export default LandingBar;