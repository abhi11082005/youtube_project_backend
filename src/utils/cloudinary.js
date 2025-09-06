import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"     

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
         
    }) 
    console.log("Cloudinary configured successfully");

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload file on cloudianry
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfully
        console.log("file uploaded on cloudinary",response.url);
 
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath) //removed the local saved temporary file if upload operation got failed
        return null;
    }
}
const deleteFromCloudinary = async (publicId, resourceType="image") =>{
    try {
        if(!publicId) return null
        const response=await cloudinary.uploader.destroy(publicId,{
            resource_type:resourceType
        })
        return response
    } catch (error) {
        return null;
    }
}


export {uploadOnCloudinary, deleteFromCloudinary}