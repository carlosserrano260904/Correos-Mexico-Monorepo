import { Test, TestingModule } from '@nestjs/testing';
import { ListarContactosQueryHandler } from '../../../application/use-cases/listar-contactos/listar-contactos.handler';
import { ListarContactosQuery } from '../../../application/use-cases/listar-contactos/listar-contactos.query';
import { RepositoryMocks } from '../../mocks/repository-mocks';
import { Result } from '../../../../utils/result';

import { GUIA_READ_REPOSITORY } from '../../../application/ports/outbound/guia-read.repository.interface';

describe('ListarContactosQueryHandler', () => {
  let handler: ListarContactosQueryHandler;
  let module: TestingModule;
  let repositoryMocks: any;

  beforeEach(async () => {
    repositoryMocks = RepositoryMocks.getAllMocks();

    module = await Test.createTestingModule({
      providers: [
        ListarContactosQueryHandler,
        {
          provide: GUIA_READ_REPOSITORY,
          useValue: repositoryMocks.GUIA_READ_REPOSITORY
        }
      ]
    }).compile();

    handler = module.get<ListarContactosQueryHandler>(ListarContactosQueryHandler);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should return list of contactos successfully', async () => {
      const query = new ListarContactosQuery();
      const mockContactosList = [
        {
          id: 'CONT001',
          nombres: 'Juan',
          apellidos: 'Pérez',
          telefono: '5551234567',
          email: 'juan.perez@email.com',
          tipo: 'REMITENTE',
          direccion: {
            calle: 'Av. Reforma',
            numero: '123',
            codigoPostal: '06000',
            localidad: 'Ciudad de México'
          }
        },
        {
          id: 'CONT002',
          nombres: 'María',
          apellidos: 'González',
          telefono: '5559876543',
          email: 'maria.gonzalez@email.com',
          tipo: 'DESTINATARIO',
          direccion: {
            calle: 'Calle Morelos',
            numero: '456',
            codigoPostal: '44100',
            localidad: 'Guadalajara'
          }
        }
      ];

      repositoryMocks.GUIA_READ_REPOSITORY.findAllContactos
        .mockResolvedValue(mockContactosList);

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual(mockContactosList);
      expect(result.getValue()).toHaveLength(2);
      expect(repositoryMocks.GUIA_READ_REPOSITORY.findAllContactos).toHaveBeenCalledTimes(1);
    });

    it('should return empty list when no contactos exist', async () => {
      const query = new ListarContactosQuery();

      repositoryMocks.GUIA_READ_REPOSITORY.findAllContactos
        .mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual([]);
      expect(result.getValue()).toHaveLength(0);
    });

    it('should return failure when repository throws error', async () => {
      const query = new ListarContactosQuery();

      repositoryMocks.GUIA_READ_REPOSITORY.findAllContactos
        .mockRejectedValue(new Error('Connection timeout'));

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('Error al listar contactos');
      expect(result.getError()).toContain('Connection timeout');
    });

    it('should handle different contact types', async () => {
      const query = new ListarContactosQuery();
      const mockRemitentes = [
        {
          nombres: 'Juan',
          apellidos: 'Pérez', 
          tipo: 'REMITENTE'
        }
      ];

      repositoryMocks.GUIA_READ_REPOSITORY.findAllContactos
        .mockResolvedValue(mockRemitentes);

      const result = await handler.execute(query);

      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual(mockRemitentes);
    });
  });
});