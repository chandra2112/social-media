import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: 'dsazvxiqu', 
  api_key: '831513944438376', 
  api_secret: 'oSiGYvkSRpo5SxcWTNbFekH3gEA' 
});


const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath ,{
            resource_type:'auto'
            
        })
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteOnCloudinary = async(url , resource_type = "image")=>{
    const publicId = `${url.split("/")[7]}/${url.split("/")[8].split(".")[0]}`
    try {
        return await cloudinary.uploader.destroy(publicId,{resource_type})
        
    } catch (error) {
        return null
        
    }
}

export {uploadOnCloudinary, deleteOnCloudinary}