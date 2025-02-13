"use client"

interface GroupProps{

    name:string,
    onClick:()=>any
}

const Group=({name,onClick}:GroupProps)=>{

    return (
      
      <button onClick={onClick}>
        <div className="flex justify-between items-center cursor-pointer w-100 h-[85px] border-t border-neutral-700 px-3 hover:bg-[#202d33]">
        <div className="flex justify-between w-100 h-100 p-3">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-1">
                <div className="flex flex-col justify-center h-full text-xl">
                  {name?name[0]?.toUpperCase():""}
                </div>
          </div>
          <div className="flex flex-col justify-between text-white">
          
            <h1 className="font-semibold m-3 text-lg mb-1">{name}</h1>

          </div>
        </div>
        
      </div>
      </button>
  
    )
}

export default Group;