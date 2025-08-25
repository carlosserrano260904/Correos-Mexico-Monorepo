import { Test, TestingModule } from '@nestjs/testing';
import { DescuentosController } from './descuentos.controller';
import { DescuentosService } from './descuentos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Descuento } from './entities/descuento.entity';
import { Repository } from 'typeorm';

describe('DescuentosController', () => {
  let controller: DescuentosController;
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
      controllers: [DescuentosController],
      providers: [
        DescuentosService,
        {
          provide: getRepositoryToken(Descuento),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<DescuentosController>(DescuentosController);
    service = module.get<DescuentosService>(DescuentosService);
    repository = module.get<Repository<Descuento>>(getRepositoryToken(Descuento));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new descuento', async () => {
      const createDescuentoDto = {
        nombre: 'Descuento de Primera Compra',
        descripcion: 'Descuento especial para nuevos clientes',
        tipo: 'porcentaje' as any,
        valor: 15,
        tipo_aplicacion: 'primera_compra' as any,
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

      const result = await controller.create(createDescuentoDto);
      
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of descuentos', async () => {
      const expectedDescuentos = [
        { id: 1, nombre: 'Descuento 1', descripcion: 'Test discount' },
        { id: 2, nombre: 'Descuento 2', descripcion: 'Another test discount' },
      ];

      mockRepository.find.mockResolvedValue(expectedDescuentos);

      const result = await controller.findAll();
      
      expect(result).toEqual(expectedDescuentos);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
