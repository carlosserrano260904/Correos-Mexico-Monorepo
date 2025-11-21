import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { CrearGuiaCommandHandler } from '../../../application/use-cases/crear-guia/crear-guia.handler';
import { CrearGuiaCommand } from '../../../application/use-cases/crear-guia/crear-guia.command';
import { RepositoryMocks } from '../../mocks/repository-mocks';
import { GuiasTrazabilidadTestSetup } from '../../setup/test-setup';
import { Result } from '../../../../utils/result';

import { GUIAREPOSITORYINTERFACE } from '../../../application/ports/outbound/guia.repository.interface';
import { PDF_GENERATOR_REPOSITORY_INTERFACE } from '../../../application/ports/outbound/pdf-generator.repository.interface';
import { QR_GENERATOR_REPOSITORY } from '../../../application/ports/outbound/qr-generator.repository.interface';
import { GOOGLE_GEOCODE_REPOSITORY_INTERFACE } from '../../../application/ports/outbound/geocode.repository.interface';
import { AWS_REPOSITORY_INTERFACE } from '../../../application/ports/outbound/aws.repository.interface';

jest.mock('../../../application/use-cases/crear-guia/mapper/crear-guia.mapper', () => ({
  mapperCrearGuia: jest.fn().mockReturnValue({
    NumeroRastreo: {
      getNumeroRastreo: 'TEST123456789'
    },
    SituacionActual: {
      getSituacion: 'CREADA'
    },
    hacerMovimiento: jest.fn()
  })
}));

describe('CrearGuiaCommandHandler', () => {
  let handler: CrearGuiaCommandHandler;
  let module: TestingModule;
  let repositoryMocks: any;

  beforeEach(async () => {
    repositoryMocks = RepositoryMocks.getAllMocks();

    module = await Test.createTestingModule({
      providers: [
        CrearGuiaCommandHandler,
        {
          provide: GUIAREPOSITORYINTERFACE,
          useValue: repositoryMocks.GUIAREPOSITORYINTERFACE
        },
        {
          provide: PDF_GENERATOR_REPOSITORY_INTERFACE,
          useValue: repositoryMocks.PDF_GENERATOR_REPOSITORY_INTERFACE
        },
        {
          provide: QR_GENERATOR_REPOSITORY,
          useValue: repositoryMocks.QR_GENERATOR_REPOSITORY
        },
        {
          provide: GOOGLE_GEOCODE_REPOSITORY_INTERFACE,
          useValue: repositoryMocks.GOOGLE_GEOCODE_REPOSITORY_INTERFACE
        },
        {
          provide: AWS_REPOSITORY_INTERFACE,
          useValue: repositoryMocks.AWS_REPOSITORY_INTERFACE
        }
      ]
    }).compile();

    handler = module.get<CrearGuiaCommandHandler>(CrearGuiaCommandHandler);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should create a guia successfully with nacional service', async () => {
      // Arrange
      const command = new CrearGuiaCommand(
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().remitente,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().destinatario,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().dimensiones,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().peso,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().valorDeclarado,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().tipoServicio as any
      );

      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.numeroRastreo).toBe('TEST123456789');
      expect(result.pdf).toBeInstanceOf(Buffer);

      expect(repositoryMocks.GOOGLE_GEOCODE_REPOSITORY_INTERFACE.obtenerCoordenadas).toHaveBeenCalledTimes(2);
      expect(repositoryMocks.GUIAREPOSITORYINTERFACE.save).toHaveBeenCalledTimes(1);
      expect(repositoryMocks.QR_GENERATOR_REPOSITORY.generarQRComoDataURL).toHaveBeenCalledTimes(1);
      expect(repositoryMocks.PDF_GENERATOR_REPOSITORY_INTERFACE.generarGuiaPDFNacional).toHaveBeenCalledTimes(1);
    });

    it('should create a guia successfully with internacional service', async () => {
      // Arrange
      const commandData = GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand();
      const command = new CrearGuiaCommand(
        commandData.remitente,
        commandData.destinatario,
        commandData.dimensiones,
        commandData.peso,
        commandData.valorDeclarado,
        'internacional' as any
      );

      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.numeroRastreo).toBe('TEST123456789');
      expect(result.pdf).toBeInstanceOf(Buffer);

      expect(repositoryMocks.PDF_GENERATOR_REPOSITORY_INTERFACE.generarGuiaPDFInternacional).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when remitente coordinates fail', async () => {
      // Arrange
      const command = new CrearGuiaCommand(
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().remitente,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().destinatario,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().dimensiones,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().peso,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().valorDeclarado,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().tipoServicio as any
      );

      repositoryMocks.GOOGLE_GEOCODE_REPOSITORY_INTERFACE.obtenerCoordenadas
        .mockResolvedValueOnce(Result.failure('Error getting coordinates'));

      await expect(handler.execute(command)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when destinatario coordinates fail', async () => {
      const command = new CrearGuiaCommand(
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().remitente,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().destinatario,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().dimensiones,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().peso,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().valorDeclarado,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().tipoServicio as any
      );

      repositoryMocks.GOOGLE_GEOCODE_REPOSITORY_INTERFACE.obtenerCoordenadas
        .mockResolvedValueOnce(Result.success(GuiasTrazabilidadTestSetup.mockData.mockCoordenadas()))
        .mockResolvedValueOnce(Result.failure('Error getting coordinates'));

      await expect(handler.execute(command)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when QR generation fails', async () => {
      const command = new CrearGuiaCommand(
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().remitente,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().destinatario,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().dimensiones,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().peso,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().valorDeclarado,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().tipoServicio as any
      );

      repositoryMocks.QR_GENERATOR_REPOSITORY.generarQRComoDataURL
        .mockResolvedValue(Result.failure('QR generation failed'));

      await expect(handler.execute(command)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when PDF generation fails', async () => {
      const command = new CrearGuiaCommand(
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().remitente,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().destinatario,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().dimensiones,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().peso,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().valorDeclarado,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().tipoServicio as any
      );

      repositoryMocks.PDF_GENERATOR_REPOSITORY_INTERFACE.generarGuiaPDFNacional
        .mockResolvedValue(Result.failure('PDF generation failed'));

      await expect(handler.execute(command)).rejects.toThrow(InternalServerErrorException);
    });

    it('should handle all repository dependencies correctly', async () => {
      const command = new CrearGuiaCommand(
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().remitente,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().destinatario,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().dimensiones,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().peso,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().valorDeclarado,
        GuiasTrazabilidadTestSetup.mockData.validCrearGuiaCommand().tipoServicio as any
      );

      await handler.execute(command);

      expect(repositoryMocks.GOOGLE_GEOCODE_REPOSITORY_INTERFACE.obtenerCoordenadas).toHaveBeenCalledWith(
        expect.objectContaining({
          calle: command.remitente.direccion.calle,
          codigoPostal: command.remitente.direccion.codigoPostal
        })
      );

      expect(repositoryMocks.QR_GENERATOR_REPOSITORY.generarQRComoDataURL).toHaveBeenCalledWith(
        expect.objectContaining({
          numeroDeRastreo: 'TEST123456789',
          estado: 'CREADA'
        })
      );
    });
  });
});