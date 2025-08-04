import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

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

/**
 * Suite de pruebas para el servicio de Unidades
 */
describe('UnidadesService', () => {
  let service: UnidadesService;
  let unidadRepo: jest.Mocked<Repository<Unidad>>;
  let tipoVehiculoRepo: jest.Mocked<Repository<TipoVehiculo>>;
  let oficinaRepo: jest.Mocked<Repository<Oficina>>;
  let tipoOficinaRepo: jest.Mocked<Repository<TipoVehiculoOficina>>;
  let conductorRepo: jest.Mocked<Repository<Conductor>>;
  let historialSvc: jest.Mocked<HistorialAsignacionesService>;
  let dataSource: jest.Mocked<DataSource>;

  // Datos de prueba mockeados
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
  };

  const mockConductor: Conductor = {
    curp: 'LOMM850505MDFRRT02',
    nombreCompleto: 'Juan Pérez',
    disponibilidad: true,
    licenciaVigente: true,
    oficina: mockOficina,
  } as Conductor;

  const mockUnidad: Unidad = {
    id: '1',
    tipoVehiculoId: 'camion de 10 mtrs',
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
  };

  /**
   * Configuración inicial antes de cada prueba
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnidadesService,
        // Mock de repositorios y servicios
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
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Oficina),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TipoVehiculoOficina),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
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
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {
                save: jest.fn(),
              },
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    // Obtener instancias de los servicios y repositorios mockeados
    service = module.get<UnidadesService>(UnidadesService);
    unidadRepo = module.get(getRepositoryToken(Unidad));
    tipoVehiculoRepo = module.get(getRepositoryToken(TipoVehiculo));
    oficinaRepo = module.get(getRepositoryToken(Oficina));
    tipoOficinaRepo = module.get(getRepositoryToken(TipoVehiculoOficina));
    conductorRepo = module.get(getRepositoryToken(Conductor));
    historialSvc = module.get(HistorialAsignacionesService);
    dataSource = module.get(DataSource);
  });

  /**
   * Pruebas para el método findAll()
   */
  describe('findAll', () => {
    it('debería retornar un array de todas las unidades', async () => {
      // Configurar mock
      unidadRepo.find.mockResolvedValue([mockUnidad]);

      // Ejecutar método
      const result = await service.findAll();
      
      // Verificar resultados
      expect(result).toHaveLength(1);
      expect(result[0].placas).toBe('ABC1234');
      expect(unidadRepo.find).toHaveBeenCalledWith({
        relations: ['tipoVehiculo', 'oficina', 'conductor'],
      });
    });
  });

  /**
   * Pruebas para el método findByOficina()
   */
  describe('findByOficina', () => {
    it('debería retornar unidades disponibles filtradas por oficina', async () => {
      // Configurar mock
      unidadRepo.find.mockResolvedValue([mockUnidad]);

      // Ejecutar método
      const result = await service.findByOficina('00304');
      
      // Verificar resultados
      expect(result).toHaveLength(1);
      expect(result[0].placas).toBe('ABC1234');
      expect(unidadRepo.find).toHaveBeenCalledWith({
        where: {
          oficina: { clave_cuo: '00304' },
          estado: 'disponible',
        },
        relations: ['tipoVehiculo', 'oficina', 'conductor'],
      });
    });
  });

  /**
   * Pruebas para el método create()
   */
  describe('create', () => {
    it('debería lanzar un error cuando la oficina no existe', async () => {
      // Datos de prueba
      const createDto: CreateUnidadDto = {
        tipoVehiculo: 'Camión de 10 ton',
        placas: 'ABC1234',
        volumenCarga: 120.5,
        numEjes: 3,
        numLlantas: 10,
        claveOficina: '99999',
        tarjetaCirculacion: 'TC-10001',
      };

      // Configurar mock
      oficinaRepo.findOne.mockResolvedValue(null);

      // Verificar que lanza error
      await expect(service.create(createDto)).rejects.toThrow(
        'Oficina con clave 99999 no encontrada',
      );
    });
  });

  /**
   * Pruebas para el método assignZona()
   */
  describe('assignZona', () => {
    it('debería asignar correctamente una zona a la unidad', async () => {
      // Datos de prueba
      const assignDto: AssignZonaDto = {
        claveCuoDestino: '00305',
      };

      // Configurar mocks
      const mockOficinaDestino: Oficina = {
        ...mockOficina,
        clave_cuo: '00305',
        clave_unica_zona: '00304',
      };

      unidadRepo.findOne.mockResolvedValue(mockUnidad);
      oficinaRepo.findOne.mockResolvedValue(mockOficinaDestino);
      unidadRepo.save.mockResolvedValue({ ...mockUnidad, zonaAsignada: '00305' });

      // Ejecutar método
      const result = await service.assignZona('ABC1234', assignDto);

      // Verificar resultados
      expect(result.zonaAsignada).toBe('00305');
    });

    it('debería lanzar error cuando la oficina destino no existe', async () => {
      // Datos de prueba
      const assignDto: AssignZonaDto = {
        claveCuoDestino: '99999',
      };

      // Configurar mocks
      unidadRepo.findOne.mockResolvedValue(mockUnidad);
      oficinaRepo.findOne.mockResolvedValue(null);

      // Verificar que lanza error
      await expect(service.assignZona('ABC1234', assignDto)).rejects.toThrow(
        'Oficina destino no encontrada',
      );
    });
  });

  /**
   * Pruebas para el método getTiposVehiculoPorOficina()
   */
  describe('getTiposVehiculoPorOficina', () => {
    it('debería retornar los tipos de vehículo permitidos para una oficina', async () => {
      // Configurar mocks
      const mockTipoOficina: TipoVehiculoOficina = {
        id: 1,
        tipoOficina: 'CP',
        tipoVehiculoId: mockTipoVehiculo.id,
        tipoVehiculo: mockTipoVehiculo,
      };

      oficinaRepo.findOne.mockResolvedValue(mockOficina);
      tipoOficinaRepo.find.mockResolvedValue([mockTipoOficina]);

      // Ejecutar método
      const result = await service.getTiposVehiculoPorOficina('00304');

      // Verificar resultados
      expect(result.tiposVehiculo).toContain('Camión de 10 ton');
      expect(oficinaRepo.findOne).toHaveBeenCalledWith({
        where: { clave_cuo: '00304' },
      });
    });
  });

  /**
   * Pruebas para el método findOne()
   */
  describe('findOne', () => {
    it('debería retornar una unidad cuando se busca por ID existente', async () => {
      // Configurar mock
      unidadRepo.findOne.mockResolvedValue(mockUnidad);

      // Ejecutar método
      const result = await service.findOne('1');

      // Verificar resultados
      expect(result.id).toBe('1');
      expect(unidadRepo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('debería lanzar error cuando la unidad no existe', async () => {
      // Configurar mock
      unidadRepo.findOne.mockResolvedValue(null);

      // Verificar que lanza error
      await expect(service.findOne('999')).rejects.toThrow(
        'Unidad con ID 999 no encontrada',
      );
    });
  });
});