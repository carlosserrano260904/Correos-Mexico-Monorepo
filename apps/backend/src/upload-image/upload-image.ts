import {v2 as cloudinary} from 'cloudinary'

export const UploadImageProvider={
    provide:'CLOUDINARY',
    useFactory:()=>{
        return cloudinary.config({
            cloud_name:'dgpd2ljyh',
            api_key:'967779892245998',
            api_secret:'IWhy_3YTwnaWWMoVFdXusxHG_vs'
        })
    }
}