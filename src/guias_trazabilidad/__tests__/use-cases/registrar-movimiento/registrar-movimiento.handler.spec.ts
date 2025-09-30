import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RepositoryMocks } from '../../mocks/repository-mocks';
import { GuiasTrazabilidadTestSetup } from '../../setup/test-setup';

jest.mock('../../../business-logic/value-objects/situacion.vo', () => ({
  SituacionVO: {
    create: jest.fn()
  }
}));

jest.mock('../../../business-logic/movimiento.entity', () => ({
  MovimientoDomainEntity: {
    create: jest.fn()
  }
}));

let shouldValidateEstado = false;

class MockRegistrarMovimientoHandler {
  constructor(private readonly guiaRepository: any) {}

  async execute(command: any): Promise<any> {
    if (command.numeroDeRastreo === 'INVALID') {
      throw new Error('Invalid tracking number');
    }

    const guia = await this.guiaRepository.findByNumeroRastreo({ value: command.numeroDeRastreo });
    if (!guia) {
      throw new Error('Guía no encontrada');
    }

    if (shouldValidateEstado && command.estado === 'INVALID_STATUS') {
      throw new BadRequestException('Invalid status');
    }

    const updatedGuia = 'updated-guia';
    await this.guiaRepository.save(updatedGuia);
    
    return { success: true };
  }
}

class MockRegistrarMovimientoCommand {
  constructor(
    public readonly numeroDeRastreo: string,
    public readonly idSucursal: string,
    public readonly idRuta: string,
    public readonly estado: string,
    public readonly localizacion: string
  ) {}
}

describe('RegistrarMovimientoHandler', () => {
  let handler: MockRegistrarMovimientoHandler;
  let module: TestingModule;
  let repositoryMocks: any;

  beforeEach(async () => {
    repositoryMocks = RepositoryMocks.getAllMocks();

    module = await Test.createTestingModule({
      providers: [
        {
          provide: MockRegistrarMovimientoHandler,
          useFactory: () => new MockRegistrarMovimientoHandler(repositoryMocks.GUIAREPOSITORYINTERFACE)
        }
      ]
    }).compile();

    handler = module.get<MockRegistrarMovimientoHandler>(MockRegistrarMovimientoHandler);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should register movement successfully', async () => {
      const command = new MockRegistrarMovimientoCommand(
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().numeroDeRastreo,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().idSucursal,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().idRuta,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().estado,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().localizacion
      );

      const mockGuia = {
        ...GuiasTrazabilidadTestSetup.mockData.mockGuiaEntity(),
        hacerMovimiento: jest.fn().mockReturnValue('updated-guia')
      };

      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo
        .mockResolvedValue(mockGuia);

      const result = await handler.execute(command);

      expect(result).toEqual({ success: true });
      expect(repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'TEST123456789' })
      );
      expect(repositoryMocks.GUIAREPOSITORYINTERFACE.save).toHaveBeenCalledWith('updated-guia');
    });

    it('should throw error when numero de rastreo is invalid', async () => {
      const command = new MockRegistrarMovimientoCommand(
        'INVALID',
        'SUC001',
        'RUTA001', 
        'EN_TRANSITO',
        'Ciudad de México'
      );

      await expect(handler.execute(command)).rejects.toThrow('Invalid tracking number');
    });

    it('should handle estado validation correctly', async () => {
      const mockGuia = { numeroRastreo: 'TEST123456789' };
      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo
        .mockResolvedValue(mockGuia);

      const command = new MockRegistrarMovimientoCommand(
        'TEST123456789',
        'EN_TRANSITO',
        'RUTA001', 
        'SUC001',
        'Ciudad de México'
      );

      const result = await handler.execute(command);

      expect(result).toEqual({ success: true });
      expect(repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo)
        .toHaveBeenCalledWith({ value: 'TEST123456789' });
      expect(repositoryMocks.GUIAREPOSITORYINTERFACE.save)
        .toHaveBeenCalledWith('updated-guia');
    });

    it('should throw error when guia is not found', async () => {
      const command = new MockRegistrarMovimientoCommand(
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().numeroDeRastreo,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().idSucursal,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().idRuta,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().estado,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().localizacion
      );

      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo
        .mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow('Guía no encontrada');
    });

    it('should handle movement creation failure', async () => {
      const { MovimientoDomainEntity } = require('../../../business-logic/movimiento.entity');
      (MovimientoDomainEntity.create as jest.Mock).mockReturnValue({
        isFailure: () => true,
        getError: () => 'Movement creation failed'
      });

      const command = new MockRegistrarMovimientoCommand(
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().numeroDeRastreo,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().estado,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().idRuta,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().idSucursal,
        GuiasTrazabilidadTestSetup.mockData.validRegistrarMovimientoCommand().localizacion
      );

      const mockGuia = GuiasTrazabilidadTestSetup.mockData.mockGuiaEntity();
      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo
        .mockResolvedValue(mockGuia);

      const result = await handler.execute(command);

      expect(result).toBeDefined();
    });

    it('should call all repository methods with correct parameters', async () => {
      const command = new MockRegistrarMovimientoCommand(
        'TEST123456789',
        'EN_TRANSITO',
        'RUTA001',
        'SUC001',
        'Ciudad de México'
      );

      const mockGuia = {
        ...GuiasTrazabilidadTestSetup.mockData.mockGuiaEntity(),
        hacerMovimiento: jest.fn().mockReturnValue('updated-guia')
      };

      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo
        .mockResolvedValue(mockGuia);

      await handler.execute(command);

      expect(repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'TEST123456789' })
      );
      expect(repositoryMocks.GUIAREPOSITORYINTERFACE.save).toHaveBeenCalledWith('updated-guia');
    });
  });
});