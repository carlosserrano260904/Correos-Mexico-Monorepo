import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';

export class GuiasTrazabilidadTestSetup {
  static async createTestingModule(
    providers: any[] = [],
  ): Promise<TestingModule> {
    const moduleBuilder = Test.createTestingModule({
      imports: [CqrsModule],
      providers: [...providers],
    });

    return await moduleBuilder.compile();
  }

  static createSpyObject<T = any>(
    baseName: string,
    methodNames: string[],
  ): jest.Mocked<T> {
    const obj: any = {};

    for (const method of methodNames) {
      obj[method] = jest.fn();
    }

    return obj as jest.Mocked<T>;
  }

  /** Mock de los datos de prueba */
  static mockData = {
    validCrearGuiaCommand: () => ({
      remitente: {
        nombres: 'Juan',
        apellidos: 'Pérez',
        telefono: '5551234567',
        direccion: {
          calle: 'Av. Reforma',
          numero: '123',
          numeroInterior: '4A',
          asentamiento: 'Centro',
          codigoPostal: '06000',
          localidad: 'Ciudad de México',
          estado: 'Ciudad de México',
          pais: 'México',
          referencia: 'Frente al parque',
        },
      },
      destinatario: {
        nombres: 'María',
        apellidos: 'González',
        telefono: '5559876543',
        direccion: {
          calle: 'Calle Morelos',
          numero: '456',
          asentamiento: 'San Juan',
          codigoPostal: '44100',
          localidad: 'Guadalajara',
          estado: 'Jalisco',
          pais: 'México',
        },
      },
      dimensiones: {
        alto_cm: 10,
        ancho_cm: 15,
        largo_cm: 20,
      },
      peso: 1.5,
      valorDeclarado: 500,
      tipoServicio: 'nacional',
    }),

    validRegistrarMovimientoCommand: () => ({
      numeroDeRastreo: 'TEST123456789',
      estado: 'EN_TRANSITO',
      idRuta: 'RUTA001',
      idSucursal: 'SUC001',
      localizacion: 'Ciudad de México',
    }),

    validObtenerGuiaQuery: () => ({
      numeroRastreo: 'TEST123456789',
    }),

    mockCoordenadas: () => ({
      latitud: 19.4326,
      longitud: -99.1332,
    }),

    mockGuiaEntity: () => ({
      NumeroRastreo: {
        getNumeroRastreo: 'TEST123456789',
      },
      SituacionActual: {
        getSituacion: 'CREADA',
      },
      hacerMovimiento: jest.fn(),
    }),

    mockPDFBuffer: () => Buffer.from('mock-pdf-content'),

    mockQRDataURL: () =>
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  };
}
