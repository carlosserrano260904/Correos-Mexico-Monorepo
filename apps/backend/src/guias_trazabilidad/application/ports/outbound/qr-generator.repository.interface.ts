import { Result } from '../../../../utils/result';
export const QR_GENERATOR_REPOSITORY = Symbol('QRGeneratorRepository');

interface QRData {
  numeroDeRastreo: string;
  idSucursal: string;
  idRuta: string;
  estado: string;
  localizacion: string;
}

export interface QRGeneratorRepositoryInterface {
  // genera el qr contenido en el mismo texto de esta url, para insertarlo en html <img= 'url'>
  generarQRComoDataURL(payload: QRData): Promise<Result<string>>;
  // genera el qr con buffer de bits para manipulacion binaria
  generarQRComoBuffer(payload: QRData): Promise<Result<Buffer>>;
  // genera el qr en formato SVG para gráficos vectoriales escalables
  generarQRComoSVG(payload: QRData): Promise<Result<string>>;
  // genera el qr como caracteres ASCII para visualización en terminal
  generarQRComoTextoEnConsola(payload: QRData): Promise<Result<string>>;
}
