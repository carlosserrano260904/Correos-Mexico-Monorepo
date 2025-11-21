import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { AWSRepositoryInterface } from '../../../guias_trazabilidad/application/ports/outbound/aws.repository.interface';
import { AWS_S3_CLIENT } from "./aws.provider";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class AWSRepository implements AWSRepositoryInterface {

    constructor(
        @Inject(AWS_S3_CLIENT)
        private readonly s3: S3Client,
        private readonly config: ConfigService,
    ) {}

    /**
     * Subir el PDF a S3
     * @param {Buffer} pdf - Buffer del PDF a subir
     * @param {string} numeroRastreo - Numero de rastreo de la guia
     * @returns {string} retorna - el key (nombre del archivo) con el que fue registrado en el bucket de S3
     */
    async subirPDF(pdf: Buffer, numeroRastreo: string): Promise<string> {
        const key = `pdf/guias/${ Date.now() }/${ numeroRastreo }-guia.pdf`;
        const command = new PutObjectCommand({
            Bucket: this.config.get<string>('AWS_S3_BUCKET'),
            Key: key,
            ContentType: 'application/pdf',
            Body: pdf,
            ACL: 'public-read'
        })
        try {
            await this.s3.send(command);
            console.log('PDF subido a S3'); // TODO: eliminar, comentario de debug
            return key;
        } catch (error) {
            if (error instanceof S3ServiceException) {
                console.log(error.$metadata, error.name, error.message); // TODO: eliminar, comentario de debug
                throw new InternalServerErrorException(`Error al subir el PDF a S3: ${error.message}`);
            }
            throw new InternalServerErrorException(`Error al subir el PDF a S3: ${error.message}`);
        }
    }

    /**
     * Obtiene la url firmada del bucket para poder descargar el buffer
     * @param {string} key - El key que se debio de haber guardado en la base de datos
     * @returns {string} - la url firmada
     */
    async obtenerURLPDF(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.config.get<string>('AWS_S3_BUCKET'),
            Key: key
        })
        try {
            const urlFirmada = await getSignedUrl(this.s3, command, {
                expiresIn: 60 * 60 * 24 * 30 // 30 dias
            })
            console.log('URL obtenida'); // TODO: eliminar, comentario de debug
            return urlFirmada;
        } catch (error) {
            if (error instanceof S3ServiceException) {
                console.log(error.$metadata, error.name, error.message); // TODO: eliminar, comentario de debug
                throw new InternalServerErrorException('Error al obtener la URL del PDF de S3');
            }
            throw new InternalServerErrorException('Error al obtener la URL del PDF de S3');
        }
    }
}