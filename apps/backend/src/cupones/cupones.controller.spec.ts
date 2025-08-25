import { Test, TestingModule } from '@nestjs/testing';
import { CuponesController } from './cupones.controller';
import { CuponesService } from './cupones.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cupon } from './entities/cupon.entity';
import { Repository } from 'typeorm';

describe('CuponesController', () => {
  let controller: CuponesController;
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
      controllers: [CuponesController],
      providers: [
        CuponesService,
        {
          provide: getRepositoryToken(Cupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<CuponesController>(CuponesController);
    service = module.get<CuponesService>(CuponesService);
    repository = module.get<Repository<Cupon>>(getRepositoryToken(Cupon));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cupon', async () => {
      const createCuponDto = {
        codigo: 'TEST20',
        descripcion: 'Descuento de prueba',
        tipo: 'porcentaje' as any,
        valor: 20,
        monto_minimo: 100,
        fecha_expiracion: '2025-12-31',
        usos_maximos: 100,
      };

      const expectedCupon = {
        id: 1,
        ...createCuponDto,
        estado: 'activo',
        usos_actuales: 0,
        fecha_creacion: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedCupon);
      mockRepository.save.mockResolvedValue(expectedCupon);

      const result = await controller.create(createCuponDto);
      
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of cupones', async () => {
      const expectedCupones = [
        { id: 1, codigo: 'TEST20', descripcion: 'Test coupon' },
        { id: 2, codigo: 'TEST30', descripcion: 'Another test coupon' },
      ];

      mockRepository.find.mockResolvedValue(expectedCupones);

      const result = await controller.findAll();
      
      expect(result).toEqual(expectedCupones);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
