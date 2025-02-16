const LandingHero=()=>{
    return(
   
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>File Sharer</h1>
                <div className="flex flex-row justify-center items-center pt-5">
                   <img src={process.env.NEXT_PUBLIC_URL+"alt/files.jpg"} height={"350"} width={"550"} alt="no"></img>
                </div>
            </div>
            <div className="text-3xl font-light text-white py-2">
                    Share your files seamlessly across groups.
            </div>
            <div>
                
                {/* <Link href={"/signup"}>
                    <button className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                        Sign up
                    </button>
                </Link> */}
                
    
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal">
               
    
            </div>
        </div>
       
     )
}

export default LandingHero;