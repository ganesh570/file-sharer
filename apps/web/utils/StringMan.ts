

export function subString(str:string):string{
    const myArray:string[] = str.split("/");
    const l=myArray.length
    myArray.splice(l-1, 1);
    const joinedString = myArray.join("/");
    return joinedString;
}

export function removeString(str:string){
    const myArray:string[] = str.split("/");
   // console.log(myArray)
    const l=myArray.length
    if(l==2) return "-1";
    myArray.splice(l-2, 2);
    const joinedString = myArray.join("/")+"/";
    return joinedString;
}


export function lastWord(str:string,type:string){
    const myArray:string[] = str.split("/");
    const l=myArray.length;
    return type=="folder"?myArray[l-2]:myArray[l-1]
}

export function DatesMan(date:string){
    const myArray:string[] = date.split("T");
    const time=myArray[1]?.slice(0,5)
    const str=myArray[0]+" "+time
    return str
}
  
export function typeDet(name:any){
    const arr=name.split(".")
    if(arr[1]==="mp4"||arr[1]=="MP4") return "video/mp4"
    else if(arr[1]==="jpeg"||arr[1]==="jpg"||arr[1]==="JPG"||arr[1]=="JPEG") return "image/jpeg"
    else if(arr[1]==="png"||arr[1]==="PNG") return "image/png"
    else if(arr[1]==="pdf"||arr[1]==="PDF") return "application/pdf"
    else if(arr[1]==="avi"||arr[1]=="AVI") return "video/avi"
    else if(arr[1]==="mp3"||arr[1]=="MP3") return "audio/mp3"
    else return "application/x-www-form-urlencoded"
}

export async function removeSpaces(name:any){
    const result = name.replace(/\s/g, "_");
    return result;
}