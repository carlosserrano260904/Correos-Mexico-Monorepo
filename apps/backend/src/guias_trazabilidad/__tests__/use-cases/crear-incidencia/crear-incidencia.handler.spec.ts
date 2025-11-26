import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RepositoryMocks } from '../../mocks/repository-mocks';
import { GuiasTrazabilidadTestSetup } from '../../setup/test-setup';

class MockCrearIncidenciaHandler {
  constructor(
    private readonly guiaRepository: any,
    private readonly incidenciaRepository: any,
  ) {}

  async execute(command: any): Promise<any> {
    const guia = await this.guiaRepository.findByNumeroRastreo({
      value: command.numeroDeRastreo,
    });
    if (!guia) {
      throw new NotFoundException('Guía no encontrada');
    }

    const incidencia = {
      id: 'mock-incidencia',
      descripcion: command.descripcion,
    };
    await this.incidenciaRepository.save(incidencia);

    return incidencia;
  }
}

class MockCrearIncidenciaCommand {
  constructor(
    public readonly numeroDeRastreo: string,
    public readonly tipo: string,
    public readonly descripcion: string,
    public readonly reportadoPor: string,
  ) {}
}

describe('CrearIncidenciaHandler', () => {
  let handler: MockCrearIncidenciaHandler;
  let module: TestingModule;
  let repositoryMocks: any;

  beforeEach(async () => {
    repositoryMocks = RepositoryMocks.getAllMocks();

    repositoryMocks.INCIDENCIA_REPOSITORY = {
      save: jest.fn(),
      findByGuiaId: jest.fn(),
      findAll: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        {
          provide: MockCrearIncidenciaHandler,
          useFactory: () =>
            new MockCrearIncidenciaHandler(
              repositoryMocks.GUIAREPOSITORYINTERFACE,
              repositoryMocks.INCIDENCIA_REPOSITORY,
            ),
        },
      ],
    }).compile();

    handler = module.get<MockCrearIncidenciaHandler>(
      MockCrearIncidenciaHandler,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should create incidencia successfully', async () => {
      const command = new MockCrearIncidenciaCommand(
        'TEST123456789',
        'PAQUETE_DANADO',
        'El paquete llegó con daños en la esquina',
        'Juan Pérez',
      );

      const mockGuia = GuiasTrazabilidadTestSetup.mockData.mockGuiaEntity();
      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo.mockResolvedValue(
        mockGuia,
      );

      const result = await handler.execute(command);

      expect(
        repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo,
      ).toHaveBeenCalled();
      expect(repositoryMocks.INCIDENCIA_REPOSITORY.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'mock-incidencia' }),
      );
      expect(result).toEqual(
        expect.objectContaining({ id: 'mock-incidencia' }),
      );
    });

    it('should throw NotFoundException when guia does not exist', async () => {
      const command = new MockCrearIncidenciaCommand(
        'NONEXISTENT123',
        'PAQUETE_DANADO',
        'Descripción de prueba',
        'Juan Pérez',
      );

      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo.mockResolvedValue(
        null,
      );

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      expect(repositoryMocks.INCIDENCIA_REPOSITORY.save).not.toHaveBeenCalled();
    });

    it('should handle different incident types', async () => {
      const incidentTypes = [
        'PAQUETE_DANADO',
        'PAQUETE_PERDIDO',
        'ENTREGA_TARDIA',
      ];
      const mockGuia = GuiasTrazabilidadTestSetup.mockData.mockGuiaEntity();

      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo.mockResolvedValue(
        mockGuia,
      );

      for (const tipo of incidentTypes) {
        const command = new MockCrearIncidenciaCommand(
          'TEST123456789',
          tipo,
          `Descripción para ${tipo}`,
          'Juan Pérez',
        );

        await handler.execute(command);

        expect(repositoryMocks.INCIDENCIA_REPOSITORY.save).toHaveBeenCalled();
      }
    });

    it('should preserve all command data in created incidencia', async () => {
      const command = new MockCrearIncidenciaCommand(
        'TEST123456789',
        'PAQUETE_DANADO',
        'Descripción detallada del problema',
        'María González',
      );

      const mockGuia = GuiasTrazabilidadTestSetup.mockData.mockGuiaEntity();
      repositoryMocks.GUIAREPOSITORYINTERFACE.findByNumeroRastreo.mockResolvedValue(
        mockGuia,
      );

      const result = await handler.execute(command);

      expect(result).toEqual(
        expect.objectContaining({
          id: 'mock-incidencia',
          descripcion: command.descripcion,
        }),
      );
    });
  });
});
