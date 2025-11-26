import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

// Entidades
import { Unidad } from '../entities/unidad.entity';
import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';
import { TipoVehiculoOficina } from '../entities/tipo-vehiculo-oficina.entity';
import { Oficina } from '../../oficinas/entities/oficina.entity';
import { Conductor } from '../../conductores/entities/conductor.entity';

// DTOs
import { CreateUnidadDto } from '../dto/create-unidad.dto';
import { AssignConductorDto } from '../dto/assign-conductor.dto';
import { AssignZonaDto } from '../dto/assign-zona.dto';

// Servicios
import { UnidadesService } from '../unidades.service';
import { HistorialAsignacionesService } from '../../historial-asignaciones/historial-asignaciones.service';

describe('UnidadesService', () => {
  let service: UnidadesService;
  let unidadRepo: jest.Mocked<Repository<Unidad>>;
  let tipoVehiculoRepo: jest.Mocked<Repository<TipoVehiculo>>;
  let oficinaRepo: jest.Mocked<Repository<Oficina>>;
  let tipoOficinaRepo: jest.Mocked<Repository<TipoVehiculoOficina>>;
  let conductorRepo: jest.Mocked<Repository<Conductor>>;
  let historialSvc: jest.Mocked<HistorialAsignacionesService>;
  let dataSource: jest.Mocked<DataSource>;

  const mockOficina: Oficina = {
    clave_cuo: '00304',
    nombre_cuo: 'Oficina Ejemplo',
    tipo_cuo: 'CP',
    clave_unica_zona: '00305',
    clave_oficina_postal: '00304',
  } as Oficina;

  const mockTipoVehiculo: TipoVehiculo = {
    id: 1,
    tipoVehiculo: 'Camión de 10 ton',
    capacidadKg: 10000,
  } as TipoVehiculo;

  const mockConductor: Conductor = {
    curp: 'LOMM850505MDFRRT02',
    nombreCompleto: 'Juan Pérez',
    disponibilidad: true,
    licenciaVigente: true,
    oficina: mockOficina,
  } as Conductor;

  const mockUnidad: Unidad = {
    id: '1',
    tipoVehiculoId: 1,
    tipoVehiculo: mockTipoVehiculo,
    placas: 'ABC1234',
    volumenCarga: 120.5,
    numEjes: 3,
    numLlantas: 10,
    fechaAlta: new Date(),
    tarjetaCirculacion: 'TC-10001',
    curpConductor: null,
    conductor: null,
    claveOficina: '00304',
    oficina: mockOficina,
    zonaAsignada: '',
    estado: 'disponible' as const,
    envios: [],
    asignada: '00304' as unknown as Oficina,
  };

  // Mock del QueryRunner
  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    manager: {
      save: jest.fn(),
    },
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnidadesService,
        {
          provide: getRepositoryToken(Unidad),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TipoVehiculo),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Oficina),
          useValue: { findOne: jest.fn(), find: jest.fn() },
        },
        {
          provide: getRepositoryToken(TipoVehiculoOficina),
          useValue: { findOne: jest.fn(), find: jest.fn() },
        },
        {
          provide: getRepositoryToken(Conductor),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HistorialAsignacionesService,
          useValue: {
            finalizarAsignacion: jest.fn(),
            registrarAsignacion: jest.fn(),
            registrarRetornoOrigen: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<UnidadesService>(UnidadesService);
    unidadRepo = module.get(getRepositoryToken(Unidad));
    tipoVehiculoRepo = module.get(getRepositoryToken(TipoVehiculo));
    oficinaRepo = module.get(getRepositoryToken(Oficina));
    tipoOficinaRepo = module.get(getRepositoryToken(TipoVehiculoOficina));
    conductorRepo = module.get(getRepositoryToken(Conductor));
    historialSvc = module.get(HistorialAsignacionesService);
    dataSource = module.get(DataSource);

    // Resetear mocks
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar un array de todas las unidades', async () => {
      unidadRepo.find.mockResolvedValue([mockUnidad]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].placas).toBe('ABC1234');
      expect(unidadRepo.find).toHaveBeenCalledWith({
        relations: ['tipoVehiculo', 'oficina', 'conductor'],
      });
    });
  });

  describe('findByOficina', () => {
    it('debería retornar unidades disponibles filtradas por oficina', async () => {
      unidadRepo.find.mockResolvedValue([mockUnidad]);
      const result = await service.findByOficina('00304');
      expect(result).toHaveLength(1);
      expect(result[0].placas).toBe('ABC1234');
      expect(unidadRepo.find).toHaveBeenCalledWith({
        where: { oficina: { clave_cuo: '00304' }, estado: 'disponible' },
        relations: ['tipoVehiculo', 'oficina', 'conductor'],
      });
    });
  });

  describe('create', () => {
    it('debería lanzar un error cuando la oficina no existe', async () => {
      const createDto: CreateUnidadDto = {
        tipoVehiculo: 'Camión de 10 ton',
        placas: 'ABC1234',
        volumenCarga: 120.5,
        numEjes: 3,
        numLlantas: 10,
        claveOficina: '99999',
        tarjetaCirculacion: 'TC-10001',
      };
      oficinaRepo.findOne.mockResolvedValue(null);
      await expect(service.create(createDto)).rejects.toThrow(
        'Oficina con clave 99999 no encontrada',
      );
    });
  });

  describe('assignConductor', () => {
    it('debería asignar correctamente un conductor a la unidad', async () => {
      // Mock de unidad con conductor
      const unidadConConductor = {
        ...mockUnidad,
        conductor: mockConductor,
        curpConductor: mockConductor.curp,
        estado: 'no disponible',
      };

      unidadRepo.findOne.mockResolvedValue(mockUnidad);
      conductorRepo.findOne.mockResolvedValue(mockConductor);

      // Mock del manager.save para devolver la unidad con conductor cuando se guarde la unidad
      mockQueryRunner.manager.save.mockImplementation((entity) => {
        // Si es la unidad, devolver unidadConConductor
        if (entity === mockUnidad) {
          return Promise.resolve(unidadConConductor);
        }
        // Para el conductor, devolver el conductor
        return Promise.resolve(entity);
      });

      const assignDto: AssignConductorDto = {
        curpConductor: 'LOMM850505MDFRRT02',
      };
      const result = await service.assignConductor('ABC1234', assignDto);

      expect(result.conductor).toBe('LOMM850505MDFRRT02');
      expect(historialSvc.registrarAsignacion).toHaveBeenCalled();
    });

    it('debería lanzar error cuando la unidad no existe', async () => {
      unidadRepo.findOne.mockResolvedValue(null);
      const assignDto: AssignConductorDto = {
        curpConductor: 'LOMM850505MDFRRT02',
      };

      await expect(
        service.assignConductor('INVALID', assignDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error cuando el conductor no existe', async () => {
      unidadRepo.findOne.mockResolvedValue(mockUnidad);
      conductorRepo.findOne.mockResolvedValue(null);
      const assignDto: AssignConductorDto = { curpConductor: 'INVALID_CURP' };

      await expect(
        service.assignConductor('ABC1234', assignDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería desasignar conductor cuando se envía "S/C"', async () => {
      const unidadConConductor = {
        ...mockUnidad,
        conductor: mockConductor,
        curpConductor: 'LOMM850505MDFRRT02',
      };

      const unidadSinConductor = {
        ...mockUnidad,
        conductor: null,
        curpConductor: null,
        estado: 'disponible',
      };

      unidadRepo.findOne.mockResolvedValue(unidadConConductor);

      mockQueryRunner.manager.save.mockImplementation((entity) => {
        // Cuando se guarde la unidad, devolver unidadSinConductor
        if (entity === unidadConConductor) {
          return Promise.resolve(unidadSinConductor);
        }
        // Cuando se guarde el conductor, devolver el conductor
        return Promise.resolve(entity);
      });

      const assignDto: AssignConductorDto = { curpConductor: 'S/C' };
      const result = await service.assignConductor('ABC1234', assignDto);

      expect(result.conductor).toBe('S/C');
      expect(historialSvc.registrarRetornoOrigen).toHaveBeenCalled();
    });
  });

  describe('assignZona', () => {
    it('debería asignar correctamente una zona a la unidad', async () => {
      const assignDto: AssignZonaDto = { claveCuoDestino: '00305' };
      const mockOficinaDestino: Oficina = {
        ...mockOficina,
        clave_cuo: '00305',
        clave_unica_zona: '00304',
      } as Oficina;

      unidadRepo.findOne.mockResolvedValue(mockUnidad);
      oficinaRepo.findOne.mockResolvedValue(mockOficinaDestino);
      unidadRepo.save.mockResolvedValue({
        ...mockUnidad,
        zonaAsignada: '00305',
      });

      const result = await service.assignZona('ABC1234', assignDto);
      expect(result.zonaAsignada).toBe('00305');
    });

    it('debería lanzar error cuando la oficina destino no existe', async () => {
      unidadRepo.findOne.mockResolvedValue(mockUnidad);
      oficinaRepo.findOne.mockResolvedValue(null);

      await expect(
        service.assignZona('ABC1234', { claveCuoDestino: '99999' }),
      ).rejects.toThrow('Oficina destino no encontrada');
    });
  });

  describe('getTiposVehiculoPorOficina', () => {
    it('debería retornar los tipos de vehículo permitidos para una oficina', async () => {
      const mockTipoOficina: TipoVehiculoOficina = {
        id: 1,
        tipoOficina: 'CP',
        tipoVehiculoId: mockTipoVehiculo.id,
        tipoVehiculo: mockTipoVehiculo,
      } as TipoVehiculoOficina;

      oficinaRepo.findOne.mockResolvedValue(mockOficina);
      tipoOficinaRepo.find.mockResolvedValue([mockTipoOficina]);

      const result = await service.getTiposVehiculoPorOficina('00304');
      expect(result.tiposVehiculo).toContain('Camión de 10 ton');
      expect(oficinaRepo.findOne).toHaveBeenCalledWith({
        where: { clave_cuo: '00304' },
      });
    });
  });

  describe('findOne', () => {
    it('debería retornar una unidad cuando se busca por ID existente', async () => {
      unidadRepo.findOne.mockResolvedValue(mockUnidad);

      const result = await service.findOne('1');

      expect(result.id).toBe('1');
      expect(unidadRepo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['asignada', 'oficina'],
      });
    });

    it('debería lanzar error cuando la unidad no existe', async () => {
      unidadRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(
        'Unidad con ID 999 no encontrada',
      );
    });
  });
});
