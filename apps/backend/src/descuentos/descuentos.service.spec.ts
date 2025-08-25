import { Test, TestingModule } from '@nestjs/testing';
import { DescuentosService } from './descuentos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Descuento, TipoDescuento, TipoAplicacion } from './entities/descuento.entity';
import { Repository } from 'typeorm';

describe('DescuentosService', () => {
  let service: DescuentosService;
  let repository: Repository<Descuento>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DescuentosService,
        {
          provide: getRepositoryToken(Descuento),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DescuentosService>(DescuentosService);
    repository = module.get<Repository<Descuento>>(getRepositoryToken(Descuento));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new descuento', async () => {
      const createDescuentoDto = {
        nombre: 'Descuento de Primera Compra',
        descripcion: 'Descuento especial para nuevos clientes',
        tipo: TipoDescuento.PORCENTAJE,
        valor: 15,
        tipo_aplicacion: TipoAplicacion.PRIMERA_COMPRA,
        monto_minimo: 50,
        fecha_fin: '2025-12-31',
        activo: true,
      };

      const expectedDescuento = {
        id: 1,
        ...createDescuentoDto,
        fecha_creacion: new Date(),
        usos_totales: 0,
        prioridad: 1,
      };

      mockRepository.create.mockReturnValue(expectedDescuento);
      mockRepository.save.mockResolvedValue(expectedDescuento);

      const result = await service.create(createDescuentoDto);
      
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedDescuento);
    });
  });

  describe('calcularDescuentosAplicables', () => {
    it('should calculate applicable discounts for first purchase', async () => {
      const descuentoPrimeraCompra = {
        id: 1,
        nombre: 'Primera Compra',
        descripcion: 'Descuento para nuevos clientes',
        tipo: TipoDescuento.PORCENTAJE,
        valor: 10,
        tipo_aplicacion: TipoAplicacion.PRIMERA_COMPRA,
        monto_minimo: 50,
        activo: true,
        fecha_fin: new Date('2025-12-31'),
        fecha_creacion: new Date(),
        usos_totales: 0,
        prioridad: 1,
        combinable_con_cupones: true,
      };

      const descuentoMontoMinimo = {
        id: 2,
        nombre: 'Monto Mínimo',
        descripcion: 'Descuento por monto mínimo',
        tipo: TipoDescuento.CANTIDAD_FIJA,
        valor: 20,
        tipo_aplicacion: TipoAplicacion.COMPRA_MINIMA,
        monto_minimo: 100,
        activo: true,
        fecha_fin: new Date('2025-12-31'),
        fecha_creacion: new Date(),
        usos_totales: 0,
        prioridad: 2,
        combinable_con_cupones: true,
      };

      mockRepository.find.mockResolvedValue([
        descuentoPrimeraCompra,
        descuentoMontoMinimo,
      ]);

      const calculoData = {
        monto_compra: 150,
        productos_ids: [1, 2],
        categorias: ['electronics'],
        marcas: ['Apple'],
        usuario_id: 1,
        es_primera_compra: true,
      };

      const result = await service.calcularDescuentosAplicables(calculoData);
      
      expect(result.descuentos_aplicables).toHaveLength(2);
      expect(result.descuentos_aplicables[0].id).toBe(1); // Primera compra
      expect(result.descuentos_aplicables[1].id).toBe(2); // Monto mínimo
      expect(result.descuento_total).toBe(20); // Mejor descuento individual (monto fijo de 20)
    });

    it('should not apply discounts when minimum amount not met', async () => {
      const descuentoMontoMinimo = {
        id: 1,
        nombre: 'Monto Mínimo',
        descripcion: 'Descuento por monto mínimo',
        tipo: TipoDescuento.PORCENTAJE,
        valor: 10,
        tipo_aplicacion: TipoAplicacion.COMPRA_MINIMA,
        monto_minimo: 200, // High minimum
        activo: true,
        fecha_fin: new Date('2025-12-31'),
        fecha_creacion: new Date(),
        usos_totales: 0,
        prioridad: 1,
        combinable_con_cupones: true,
      };

      mockRepository.find.mockResolvedValue([descuentoMontoMinimo]);

      const calculoData = {
        monto_compra: 100, // Less than minimum
        productos_ids: [1, 2],
        categorias: ['electronics'],
        marcas: ['Apple'],
        usuario_id: 1,
        es_primera_compra: false,
      };

      const result = await service.calcularDescuentosAplicables(calculoData);
      
      expect(result.descuentos_aplicables).toHaveLength(0);
      expect(result.descuento_total).toBe(0);
    });

    it('should respect maximum discount limits', async () => {
      const descuentoConLimite = {
        id: 1,
        nombre: 'Descuento con Límite',
        descripcion: 'Descuento con límite máximo',
        tipo: TipoDescuento.PORCENTAJE,
        valor: 50, // 50%
        tipo_aplicacion: TipoAplicacion.COMPRA_MINIMA,
        monto_minimo: 50,
        descuento_maximo: 30, // Maximum $30
        activo: true,
        fecha_fin: new Date('2025-12-31'),
        fecha_creacion: new Date(),
        usos_totales: 0,
        prioridad: 1,
        combinable_con_cupones: true,
      };

      mockRepository.find.mockResolvedValue([descuentoConLimite]);

      const calculoData = {
        monto_compra: 100, // 50% would be $50, but max is $30
        productos_ids: [1, 2],
        categorias: ['electronics'],
        marcas: ['Apple'],
        usuario_id: 1,
        es_primera_compra: false,
      };

      const result = await service.calcularDescuentosAplicables(calculoData);
      
      expect(result.descuentos_aplicables).toHaveLength(1);
      expect(result.descuento_total).toBe(30); // Limited to maximum
    });
  });
});
