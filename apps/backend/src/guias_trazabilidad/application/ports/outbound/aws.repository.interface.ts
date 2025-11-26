export const AWS_REPOSITORY_INTERFACE = 'AWS_REPOSITORY_INTERFACE';

/**
 * Interface para subir los PDF a s3
 */
export interface AWSRepositoryInterface {
  /**
   * Subir PDF a s3
   * @param {Buffer} pdf - Buffer del PDF a subir
   * @param {string} nombre - Nombre del PDF a subir
   * @returns {string} - el key (nombre del archivo) con el que fue registrado en el bucket de S3
   */
  subirPDF(pdf: Buffer, nombre: string): Promise<string>;

  /**
   * Obtener la url firmada del bucket para poder descargar el buffer
   * @param {string} nombre - Nombre del PDF a obtener
   * @returns {string} - la url firmada
   */
  obtenerURLPDF(nombre: string): Promise<string>;
}
