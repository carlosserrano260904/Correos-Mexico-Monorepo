import { Test, TestingModule } from '@nestjs/testing';
import { ObtenerGuiaPorNumeroQueryHandler } from '../../../application/use-cases/obtener-guia-por-numero/obtener-guia-por-numero.handler';
import { ObtenerGuiaPorNumeroQuery } from '../../../application/use-cases/obtener-guia-por-numero/obtener-guia-por-numero.query';
import { RepositoryMocks } from '../../mocks/repository-mocks';
import { GuiasTrazabilidadTestSetup } from '../../setup/test-setup';
import { Result } from '../../../../utils/result';

import { GUIA_READ_REPOSITORY } from '../../../application/ports/outbound/guia-read.repository.interface';

describe('ObtenerGuiaPorNumeroQueryHandler', () => {
  let handler: ObtenerGuiaPorNumeroQueryHandler;
  let module: TestingModule;
  let repositoryMocks: any;

  beforeEach(async () => {
    repositoryMocks = RepositoryMocks.getAllMocks();

    module = await Test.createTestingModule({
      providers: [
        ObtenerGuiaPorNumeroQueryHandler,
        {
          provide: GUIA_READ_REPOSITORY,
          useValue: repositoryMocks.GUIA_READ_REPOSITORY,
        },
      ],
    }).compile();

    handler = module.get<ObtenerGuiaPorNumeroQueryHandler>(
      ObtenerGuiaPorNumeroQueryHandler,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should return guia successfully when found', async () => {
      const query = new ObtenerGuiaPorNumeroQuery(
        GuiasTrazabilidadTestSetup.mockData.validObtenerGuiaQuery().numeroRastreo,
      );

      const mockGuiaReadModel = {
        numero_de_rastreo: 'TEST123456789',
        remitente: {
          nombres: 'Juan',
          apellidos: 'Pérez',
          telefono: '5551234567',
        },
        destinatario: {
          nombres: 'María',
          apellidos: 'González',
          telefono: '5559876543',
        },
        situacionActual: 'CREADA',
        movimientos: [],
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      };

      repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo.mockResolvedValue(
        mockGuiaReadModel,
      );

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual(mockGuiaReadModel);
      expect(
        repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo,
      ).toHaveBeenCalledWith(query.numeroRastreo);
    });

    it('should return failure when guia is not found', async () => {
      const query = new ObtenerGuiaPorNumeroQuery('NONEXISTENT123');

      repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo.mockResolvedValue(
        null,
      );

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('no encontrada');
      expect(
        repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo,
      ).toHaveBeenCalledWith('NONEXISTENT123');
    });

    it('should return failure when repository throws error', async () => {
      const query = new ObtenerGuiaPorNumeroQuery('TEST123456789');

      repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('Error al buscar guía');
      expect(result.getError()).toContain('Database connection failed');
    });

    it('should handle different tracking numbers correctly', async () => {
      const testNumbers = ['TEST123', 'TRACK456', 'GUIDE789'];

      for (const numeroRastreo of testNumbers) {
        const query = new ObtenerGuiaPorNumeroQuery(numeroRastreo);
        const mockGuia = {
          numero_de_rastreo: numeroRastreo,
          situacionActual: 'EN_TRANSITO',
          movimientos: [],
        };

        repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo.mockResolvedValue(
          mockGuia,
        );

        const result = await handler.execute(query);

        expect(result.isFailure()).toBe(false);
        expect(result.getValue().numero_de_rastreo).toBe(numeroRastreo);
      }
    });

    it('should call repository with exact parameters', async () => {
      const numeroRastreo = 'EXACT_PARAM_TEST';
      const query = new ObtenerGuiaPorNumeroQuery(numeroRastreo);

      repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo.mockResolvedValue(
        { numero_de_rastreo: numeroRastreo },
      );

      await handler.execute(query);

      expect(
        repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo,
      ).toHaveBeenCalledWith(numeroRastreo);
      expect(
        repositoryMocks.GUIA_READ_REPOSITORY.findByNumeroRastreo,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
