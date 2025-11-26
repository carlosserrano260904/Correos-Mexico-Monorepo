import { Test, TestingModule } from '@nestjs/testing';
import { ListarGuiasQueryHandler } from '../../../application/use-cases/listar-guias/listar-guias.handler';
import { ListarGuiasQuery } from '../../../application/use-cases/listar-guias/listar-guias.query';
import { RepositoryMocks } from '../../mocks/repository-mocks';
import { Result } from '../../../../utils/result';

import { GUIA_READ_REPOSITORY } from '../../../application/ports/outbound/guia-read.repository.interface';

describe('ListarGuiasQueryHandler', () => {
  let handler: ListarGuiasQueryHandler;
  let module: TestingModule;
  let repositoryMocks: any;

  beforeEach(async () => {
    repositoryMocks = RepositoryMocks.getAllMocks();

    module = await Test.createTestingModule({
      providers: [
        ListarGuiasQueryHandler,
        {
          provide: GUIA_READ_REPOSITORY,
          useValue: repositoryMocks.GUIA_READ_REPOSITORY,
        },
      ],
    }).compile();

    handler = module.get<ListarGuiasQueryHandler>(ListarGuiasQueryHandler);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should return list of guias successfully', async () => {
      const query = new ListarGuiasQuery();
      const mockGuiasList = [
        {
          numeroRastreo: 'TEST123456789',
          remitente: { nombres: 'Juan', apellidos: 'Pérez' },
          destinatario: { nombres: 'María', apellidos: 'González' },
          situacionActual: 'CREADA',
          fechaCreacion: new Date(),
        },
        {
          numeroRastreo: 'TEST987654321',
          remitente: { nombres: 'Carlos', apellidos: 'Ruiz' },
          destinatario: { nombres: 'Ana', apellidos: 'López' },
          situacionActual: 'EN_TRANSITO',
          fechaCreacion: new Date(),
        },
      ];

      repositoryMocks.GUIA_READ_REPOSITORY.findAllGuias = jest
        .fn()
        .mockResolvedValue(mockGuiasList);

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual(mockGuiasList);
      expect(result.getValue()).toHaveLength(2);
      expect(
        repositoryMocks.GUIA_READ_REPOSITORY.findAllGuias,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty list when no guias exist', async () => {
      const query = new ListarGuiasQuery();

      repositoryMocks.GUIA_READ_REPOSITORY.findAllGuias = jest
        .fn()
        .mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual([]);
      expect(result.getValue()).toHaveLength(0);
    });

    it('should return failure when repository throws error', async () => {
      const query = new ListarGuiasQuery();

      repositoryMocks.GUIA_READ_REPOSITORY.findAllGuias = jest
        .fn()
        .mockRejectedValue(new Error('Database connection failed'));

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('Error al listar guías');
      expect(result.getError()).toContain('Database connection failed');
    });

    it('should handle repository timeout gracefully', async () => {
      const query = new ListarGuiasQuery();

      repositoryMocks.GUIA_READ_REPOSITORY.findAllGuias = jest
        .fn()
        .mockRejectedValue(new Error('Query timeout'));

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('Query timeout');
    });
  });
});
