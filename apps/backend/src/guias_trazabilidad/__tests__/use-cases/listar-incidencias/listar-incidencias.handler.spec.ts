import { Test, TestingModule } from '@nestjs/testing';
import { ListarIncidenciasQueryHandler } from '../../../application/use-cases/listar-incidencias/listar-incidencias.handler';
import { ListarIncidenciasQuery } from '../../../application/use-cases/listar-incidencias/listar-incidencias.query';
import { RepositoryMocks } from '../../mocks/repository-mocks';
import { Result } from '../../../../utils/result';

import { GUIA_READ_REPOSITORY } from '../../../application/ports/outbound/guia-read.repository.interface';

describe('ListarIncidenciasQueryHandler', () => {
  let handler: ListarIncidenciasQueryHandler;
  let module: TestingModule;
  let repositoryMocks: any;

  beforeEach(async () => {
    repositoryMocks = RepositoryMocks.getAllMocks();

    module = await Test.createTestingModule({
      providers: [
        ListarIncidenciasQueryHandler,
        {
          provide: GUIA_READ_REPOSITORY,
          useValue: repositoryMocks.GUIA_READ_REPOSITORY,
        },
      ],
    }).compile();

    handler = module.get<ListarIncidenciasQueryHandler>(
      ListarIncidenciasQueryHandler,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should return list of incidencias successfully', async () => {
      const query = new ListarIncidenciasQuery();
      const mockIncidenciasList = [
        {
          id: 'INC001',
          numeroRastreo: 'TEST123456789',
          tipo: 'PAQUETE_DANADO',
          descripcion: 'Paquete con daños',
          reportadoPor: 'Juan Pérez',
          fechaCreacion: new Date(),
          estado: 'ABIERTA',
        },
        {
          id: 'INC002',
          numeroRastreo: 'TEST987654321',
          tipo: 'ENTREGA_TARDIA',
          descripcion: 'Paquete entregado con retraso',
          reportadoPor: 'María González',
          fechaCreacion: new Date(),
          estado: 'CERRADA',
        },
      ];

      repositoryMocks.GUIA_READ_REPOSITORY.findAllIncidencias.mockResolvedValue(
        mockIncidenciasList,
      );

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual(mockIncidenciasList);
      expect(result.getValue()).toHaveLength(2);
      expect(
        repositoryMocks.GUIA_READ_REPOSITORY.findAllIncidencias,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty list when no incidencias exist', async () => {
      const query = new ListarIncidenciasQuery();

      repositoryMocks.GUIA_READ_REPOSITORY.findAllIncidencias.mockResolvedValue(
        [],
      );

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual([]);
      expect(result.getValue()).toHaveLength(0);
    });

    it('should return failure when repository throws error', async () => {
      const query = new ListarIncidenciasQuery();

      repositoryMocks.GUIA_READ_REPOSITORY.findAllIncidencias.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('Error al listar incidencias');
      expect(result.getError()).toContain('Database error');
    });
  });
});
