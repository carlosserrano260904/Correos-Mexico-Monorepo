import { Test, TestingModule } from '@nestjs/testing';
import { CuponesService } from './cupones.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cupon, TipoCupon, EstadoCupon } from './entities/cupon.entity';
import { Repository } from 'typeorm';

describe('CuponesService', () => {
  let service: CuponesService;
  let repository: Repository<Cupon>;

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
        CuponesService,
        {
          provide: getRepositoryToken(Cupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CuponesService>(CuponesService);
    repository = module.get<Repository<Cupon>>(getRepositoryToken(Cupon));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cupon', async () => {
      const createCuponDto = {
        codigo: 'TEST20',
        descripcion: 'Descuento de prueba',
        tipo: TipoCupon.PORCENTAJE,
        valor: 20,
        monto_minimo: 100,
        fecha_expiracion: '2025-12-31',
        usos_maximos: 100,
      };

      const expectedCupon = {
        id: 1,
        ...createCuponDto,
        estado: EstadoCupon.ACTIVO,
        usos_actuales: 0,
        fecha_creacion: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedCupon);
      mockRepository.save.mockResolvedValue(expectedCupon);

      const result = await service.create(createCuponDto);
      
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedCupon);
    });
  });

  describe('validarCupon', () => {
    it('should validate a valid cupon', async () => {
      const cupon = {
        id: 1,
        codigo: 'TEST20',
        descripcion: 'Test coupon',
        tipo: TipoCupon.PORCENTAJE,
        valor: 20,
        estado: EstadoCupon.ACTIVO,
        monto_minimo: 100,
        fecha_expiracion: new Date('2025-12-31'),
        usos_maximos: 100,
        usos_actuales: 50,
        fecha_creacion: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(cupon);

      const validationData = {
        codigo: 'TEST20',
        monto_compra: 150,
        usuario_id: 1,
        productos_ids: [1, 2],
        categorias: ['electronics'],
      };

      const result = await service.validarCupon(validationData);
      
      expect(result.valido).toBe(true);
      expect(result.cupon).toEqual(cupon);
      expect(result.descuento).toBe(30); // 20% de 150
    });

    it('should reject invalid cupon code', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const validationData = {
        codigo: 'INVALID',
        monto_compra: 150,
        usuario_id: 1,
        productos_ids: [1, 2],
        categorias: ['electronics'],
      };

      const result = await service.validarCupon(validationData);
      
      expect(result.valido).toBe(false);
      expect(result.mensaje).toBe('El cupón no existe');
    });

    it('should reject expired cupon', async () => {
      const expiredCupon = {
        id: 1,
        codigo: 'EXPIRED',
        descripcion: 'Expired coupon',
        tipo: TipoCupon.PORCENTAJE,
        valor: 20,
        estado: EstadoCupon.ACTIVO,
        monto_minimo: 100,
        fecha_expiracion: new Date('2020-12-31'), // Expired
        usos_maximos: 100,
        usos_actuales: 50,
        fecha_creacion: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(expiredCupon);

      const validationData = {
        codigo: 'EXPIRED',
        monto_compra: 150,
        usuario_id: 1,
        productos_ids: [1, 2],
        categorias: ['electronics'],
      };

      const result = await service.validarCupon(validationData);
      
      expect(result.valido).toBe(false);
      expect(result.mensaje).toBe('El cupón ha expirado');
    });

    it('should reject cupon when minimum amount not met', async () => {
      const cupon = {
        id: 1,
        codigo: 'TEST20',
        descripcion: 'Test coupon',
        tipo: TipoCupon.PORCENTAJE,
        valor: 20,
        estado: EstadoCupon.ACTIVO,
        monto_minimo: 200,
        fecha_expiracion: new Date('2025-12-31'),
        usos_maximos: 100,
        usos_actuales: 50,
        fecha_creacion: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(cupon);

      const validationData = {
        codigo: 'TEST20',
        monto_compra: 150, // Less than minimum
        usuario_id: 1,
        productos_ids: [1, 2],
        categorias: ['electronics'],
      };

      const result = await service.validarCupon(validationData);
      
      expect(result.valido).toBe(false);
      expect(result.mensaje).toBe('El monto mínimo para usar este cupón es $200');
    });
  });
});
