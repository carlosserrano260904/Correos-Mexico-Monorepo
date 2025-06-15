import { Injectable } from '@nestjs/common';
import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryResponse } from './upload-image.response';
const streamifier = require('streamifier')

@Injectable()
export class UploadImageService {
    uploadFile(file:Express.Multer.File):Promise<CloudinaryResponse>{
        return new Promise<CloudinaryResponse>((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream((error,result)=>{
                if(error) return reject(new Error('Ha habido un error'))
                if(!result) return reject(new Error('Ha habido otro error'))
                resolve(result)
            })
            streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    }

}
