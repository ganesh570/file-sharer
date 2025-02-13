"use client"

const RoundedBtn=({icon,onClick,className}:{
    icon:any,
    onClick:any
    className:string
})=>{
    return(
        <button className={className} onClick={onClick}>
        {icon}
        </button>
    )
}

export default RoundedBtn;