// conductores.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConductoresService } from '../conductores.service';
import { Conductor } from '../entities/conductor.entity';
import { CreateConductorDto } from '../dto/create-conductor.dto';
import { UpdateDisponibilidadDto } from '../dto/update-disponibilidad.dto';
import { UpdateLicenciaVigenteDto } from '../dto/update-licencia-vigente.dto';
import { NotFoundException } from '@nestjs/common';

describe('ConductoresService', () => {
  let service: ConductoresService;
  let repository: Repository<Conductor>;

  const mockConductor = {
    id: 1,
    nombreCompleto: 'Juan Pérez',
    curp: 'PEMJ800101HDFRRN01',
    rfc: 'PEMJ800101TUV',
    licencia: 'DL12345678',
    licenciaVigente: true,
    telefono: '5551234567',
    correo: 'juan.perez@example.com',
    fechaAlta: new Date(),
    claveOficina: '00304',
    disponibilidad: true,
    oficina: { clave_cuo: '00304' },
  };

  const mockConductorRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConductoresService,
        {
          provide: getRepositoryToken(Conductor),
          useValue: mockConductorRepository,
        },
      ],
    }).compile();

    service = module.get<ConductoresService>(ConductoresService);
    repository = module.get<Repository<Conductor>>(
      getRepositoryToken(Conductor),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllDisponibles', () => {
    it('should return all available drivers with valid license', async () => {
      mockConductorRepository.find.mockResolvedValue([mockConductor]);

      const result = await service.findAllDisponibles();

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          disponibilidad: true,
          licenciaVigente: true,
        },
        relations: ['oficina'],
      });
      expect(result).toEqual([
        {
          nombreCompleto: mockConductor.nombreCompleto,
          CURP: mockConductor.curp,
          RFC: mockConductor.rfc,
          licencia: mockConductor.licencia,
          telefono: mockConductor.telefono,
          correo: mockConductor.correo,
          sucursal: mockConductor.oficina.clave_cuo,
          disponibilidad: mockConductor.disponibilidad,
          licenciaVigente: mockConductor.licenciaVigente,
        },
      ]);
    });
  });

  describe('findBySucursal', () => {
    it('should return drivers by office clave ordered by availability', async () => {
      mockConductorRepository.find.mockResolvedValue([mockConductor]);

      const result = await service.findBySucursal('00304');

      expect(repository.find).toHaveBeenCalledWith({
        where: { oficina: { clave_cuo: '00304' } },
        relations: ['oficina'], // ✅ Ya está correcto aquí
        order: { disponibilidad: 'DESC' },
      });
      expect(result).toEqual([
        {
          nombreCompleto: mockConductor.nombreCompleto,
          CURP: mockConductor.curp,
          RFC: mockConductor.rfc,
          licencia: mockConductor.licencia,
          telefono: mockConductor.telefono,
          correo: mockConductor.correo,
          sucursal: mockConductor.oficina.clave_cuo,
          disponibilidad: mockConductor.disponibilidad,
          licenciaVigente: mockConductor.licenciaVigente,
        },
      ]);
    });
  });

  describe('create', () => {
    it('should create a new driver with default availability', async () => {
      const createDto: CreateConductorDto = {
        nombreCompleto: 'Juan Pérez',
        curp: 'PEMJ800101HDFRRN01',
        rfc: 'PEMJ800101TUV',
        licencia: 'DL12345678',
        licenciaVigente: true,
        telefono: '5551234567',
        correo: 'juan.perez@example.com',
        claveOficina: '00304',
      };

      mockConductorRepository.create.mockReturnValue(mockConductor);
      mockConductorRepository.save.mockResolvedValue(mockConductor);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        fechaAlta: expect.any(Date),
        disponibilidad: true,
      });
      expect(repository.save).toHaveBeenCalledWith(mockConductor);
      expect(result).toEqual(mockConductor);
    });
  });

  describe('updateDisponibilidad', () => {
    it('should update driver availability', async () => {
      const updateDto: UpdateDisponibilidadDto = { disponibilidad: false };

      mockConductorRepository.findOne.mockResolvedValue(mockConductor);
      mockConductorRepository.save.mockResolvedValue({
        ...mockConductor,
        disponibilidad: false,
      });

      const result = await service.updateDisponibilidad(
        'PEMJ800101HDFRRN01',
        updateDto,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { curp: 'PEMJ800101HDFRRN01' },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockConductor,
        disponibilidad: false,
      });
      expect(result.disponibilidad).toBe(false);
    });

    it('should throw NotFoundException if driver not found', async () => {
      mockConductorRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateDisponibilidad('INVALID_CURP', { disponibilidad: false }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLicenciaVigente', () => {
    it('should update driver license status', async () => {
      const updateDto: UpdateLicenciaVigenteDto = { licenciaVigente: false };

      mockConductorRepository.findOne.mockResolvedValue(mockConductor);
      mockConductorRepository.save.mockResolvedValue({
        ...mockConductor,
        licenciaVigente: false,
      });

      const result = await service.updateLicenciaVigente(
        'PEMJ800101HDFRRN01',
        updateDto,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { curp: 'PEMJ800101HDFRRN01' },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockConductor,
        licenciaVigente: false,
      });
      expect(result.licenciaVigente).toBe(false);
    });

    it('should throw NotFoundException if driver not found', async () => {
      mockConductorRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateLicenciaVigente('INVALID_CURP', {
          licenciaVigente: false,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
