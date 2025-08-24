import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class  UploadImageService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly s3: S3Client;
  private readonly endpoint?: string;

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('AWS_S3_BUCKET');
    const region = this.config.get<string>('AWS_REGION');
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    const endpoint = this.config.get<string>('AWS_S3_ENDPOINT');

    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'Faltan variables de entorno requeridas: ' +
          [
            !bucket && 'AWS_S3_BUCKET',
            !region && 'AWS_REGION',
            !accessKeyId && 'AWS_ACCESS_KEY_ID',
            !secretAccessKey && 'AWS_SECRET_ACCESS_KEY',
          ]
            .filter(Boolean)
            .join(', ')
      );
    }

    this.bucket = bucket;
    this.region = region;
    this.endpoint = endpoint;
    
    // Configure S3 client with custom endpoint for iDrive e2
    const s3Config: any = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    };
    
    // Add endpoint if using custom S3-compatible service
    if (endpoint) {
      s3Config.endpoint = `https://${endpoint}`;
      console.log(`🔗 Using custom S3 endpoint: ${s3Config.endpoint}`);
    }
    
    this.s3 = new S3Client(s3Config);
  }

  async uploadFile(file?: Express.Multer.File): Promise<string> {
      // ✅ AGREGAR ESTA VERIFICACIÓN AL INICIO:
        if (!file) {
          console.log('⚠️ No file provided, using default image');
          return 'default'; // Devolver un key por defecto
        }
    const key = `images/${uuid()}-${file.originalname}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(cmd);
    return key;
  }

  async uploadFileImage(file: Express.Multer.File): Promise<string> {
    try {
      console.log(`📤 Uploading file: ${file.originalname} (${file.size} bytes)`);
      console.log(`🗂️ Using bucket: ${this.bucket}`);
      console.log(`🌍 Using endpoint: ${this.endpoint || 'default AWS S3'}`);
      
      const key = `images/${uuid()}-${file.originalname}`;
      const cmd = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3.send(cmd);

      // Generate the correct URL based on the endpoint
      let publicUrl: string;
      if (this.endpoint) {
        // For custom S3-compatible services like iDrive e2
        publicUrl = `https://${this.endpoint}/${this.bucket}/${key}`;
      } else {
        // For standard AWS S3
        publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      
      console.log(`✅ Image uploaded successfully: ${publicUrl}`);
      return publicUrl;
      
    } catch (error) {
      console.error('❌ Error uploading file to S3:', error);
      console.error('📋 File details:', {
        name: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });
      console.error('⚙️ S3 config:', {
        bucket: this.bucket,
        region: this.region,
        endpoint: this.endpoint
      });
      throw error;
    }
  }

  async uploadEvidenceDistributor(file: Express.Multer.File): Promise<string> {
    const key = `evidenciasPaquetes/${uuid()}-${file.originalname}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(cmd);

    // Generate the correct URL based on the endpoint
    let publicUrl: string;
    if (this.endpoint) {
      // For custom S3-compatible services like iDrive e2
      publicUrl = `https://${this.endpoint}/${this.bucket}/${key}`;
    } else {
      // For standard AWS S3
      publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
    
    console.log(`📋 Evidence uploaded successfully: ${publicUrl}`);
    return publicUrl;
  }
}