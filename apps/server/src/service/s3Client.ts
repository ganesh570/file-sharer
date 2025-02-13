import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as dotenv from "dotenv";

dotenv.config();


const s3Client=new S3Client({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
})


 export async function getObject(key:string){
    const command=new GetObjectCommand({
        Bucket:process.env.AWS_BUCKET,
        Key:key,
    })
    const response=await s3Client.send(command)
    if(response.ContentType==="image/jpeg"||response.ContentType==="audio/mp3"||response.ContentType==="image/png"||response.ContentType==="video/mp4"||response.ContentType==="video/avi"||response.ContentType==="application/pdf"||response.ContentType==="mp3"||response.ContentType==="audio/mpeg"){
      return {contentType:response.ContentType,type:1,url:process.env.AWS_CLOUDFRONT+key}
    }
    const url=await getSignedUrl(s3Client,command)
    return {contentType:response.ContentType,type:2,url:url};
}   


export async function putObject(key:string,contentType?:string){
  
    const command=new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET,
        Key:key,
        ContentType:contentType
    })
    const url=await getSignedUrl(s3Client,command)
    return url;
}


export async function listObjects(prefix:string,delimiter:string){
    const command=new ListObjectsV2Command({
        Bucket:process.env.AWS_BUCKET,
        Prefix:prefix,
        Delimiter:delimiter
    })
    
    const result=await s3Client.send(command);
    const foldersList = result.CommonPrefixes;
    return {folders:result.CommonPrefixes,files:result.Contents}
}


 async function createFolder(Key:string) {
    
    const command = new PutObjectCommand({ Bucket:process.env.AWS_BUCKET, Key });
    return s3Client.send(command);
}

  
 export async function existsFolder(Key:string) {

    const command = new HeadObjectCommand({ Bucket:process.env.AWS_BUCKET, Key });
  
    try {
      await s3Client.send(command);
      return true;
    } catch (error:any) {
      if (error.name === "NotFound") {
        return false;
      } else {
        throw error;
      }
    }
  }
  
  export async function createFolderIfNotExist(Key:string) {
    if (!(await existsFolder(Key))) {
      return createFolder(Key);
    }
    return false;
  }
  
  export async function deleteItem(Key:string) {
    const command = new DeleteObjectCommand({ Bucket:process.env.AWS_BUCKET, Key });
    return s3Client.send(command);
  }