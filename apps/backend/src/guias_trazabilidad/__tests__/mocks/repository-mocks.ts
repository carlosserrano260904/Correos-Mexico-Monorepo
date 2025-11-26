import { Result } from '../../../utils/result';

/**
 * Este fichero es el mock de los repositorios de la base de datos
 */
export class RepositoryMocks {
  /**
   * Mock de GuiaRepositoryInterface
   */
  static createGuiaRepositoryMock() {
    return {
      save: jest.fn(),
      findByNumeroRastreo: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
  }

  /**
   * Mock de GuiaReadRepositoryInterface
   */
  static createGuiaReadRepositoryMock() {
    return {
      findByNumeroRastreo: jest.fn(),
      findAllGuias: jest.fn(),
      findAllIncidencias: jest.fn(),
      findAllContactos: jest.fn(),
      findAll: jest.fn(),
      findByFilters: jest.fn(),
    };
  }

  /**
   * Mock de PDFGeneratorRepositoryInterface
   */
  static createPDFGeneratorRepositoryMock() {
    return {
      generarGuiaPDFNacional: jest
        .fn()
        .mockResolvedValue(Result.success(Buffer.from('mock-national-pdf'))),
      generarGuiaPDFInternacional: jest
        .fn()
        .mockResolvedValue(
          Result.success(Buffer.from('mock-international-pdf')),
        ),
    };
  }

  /**
   * Mock de QRGeneratorRepositoryInterface
   */
  static createQRGeneratorRepositoryMock() {
    return {
      generarQRComoDataURL: jest
        .fn()
        .mockResolvedValue(Result.success('data:image/png;base64,mockQRCode')),
      generarQRComoBuffer: jest
        .fn()
        .mockResolvedValue(Result.success(Buffer.from('mock-qr-buffer'))),
    };
  }

  /**
   * Mock de GoogleGeocodeRepositoryInterface
   */
  static createGoogleGeocodeRepositoryMock() {
    return {
      obtenerCoordenadas: jest.fn().mockResolvedValue(
        Result.success({
          latitud: 19.4326,
          longitud: -99.1332,
        }),
      ),
    };
  }

  /**
   * Mock de AWSRepositoryInterface
   */
  static createAWSRepositoryMock() {
    return {
      subirPDF: jest.fn().mockResolvedValue('mock-s3-key'),
      obtenerURL: jest
        .fn()
        .mockResolvedValue('https://mock-s3-url.com/file.pdf'),
      eliminarArchivo: jest.fn().mockResolvedValue(true),
    };
  }

  /**
   * Retorna todos los mocks de aqui mismo
   */
  static getAllMocks() {
    return {
      // Repository tokens
      GUIAREPOSITORYINTERFACE: this.createGuiaRepositoryMock(),
      GUIA_READ_REPOSITORY: this.createGuiaReadRepositoryMock(),
      PDF_GENERATOR_REPOSITORY_INTERFACE:
        this.createPDFGeneratorRepositoryMock(),
      QR_GENERATOR_REPOSITORY: this.createQRGeneratorRepositoryMock(),
      GOOGLE_GEOCODE_REPOSITORY_INTERFACE:
        this.createGoogleGeocodeRepositoryMock(),
      AWS_REPOSITORY_INTERFACE: this.createAWSRepositoryMock(),
    };
  }
}
