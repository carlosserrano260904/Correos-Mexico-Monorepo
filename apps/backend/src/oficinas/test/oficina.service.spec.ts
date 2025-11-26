import { Test, TestingModule } from '@nestjs/testing';
import { OficinasService } from '../oficinas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

//Entidad
import { Oficina } from '../entities/oficina.entity';

//DTOs
import { CreateOficinaDto } from '../dto/create-oficina.dto';
import { UpdateOficinaDto } from '../dto/update-oficina.dto';

describe('OficinasService', () => {
  let service: OficinasService;
  let repo: jest.Mocked<Repository<Oficina>>;

  const mockOficina: Oficina = {
    id_oficina: 304,
    clave_cuo: '00304',
    nombre_cuo: 'Oficina Central',
    tipo_cuo: 'Sucursal',
    clave_oficina_postal: '00304',
    clave_inmueble: '00001',
    clave_inegi: '1234567890',
    clave_entidad: '15',
    nombre_entidad: 'Durango',
    nombre_municipio: 'Canatlán',
    domicilio: 'Calle falsa 1234',
    codigo_postal: '03100',
    telefono: '5555555555',
    latitud: 19.4326,
    longitud: -99.1332,
    activo: true,
    horario_atencion: 'Lun. a Vier. 9:00-18:00/Sab. 9:00-15:00',
  } as Oficina;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OficinasService,
        {
          provide: getRepositoryToken(Oficina),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OficinasService>(OficinasService);
    repo = module.get(getRepositoryToken(Oficina));
  });

  describe('update', () => {
    it('Actualizar una oficina existente', async () => {
      const updateDto: UpdateOficinaDto = { nombre_cuo: 'Oficina actualizada' };

      repo.findOneBy.mockImplementation((where) => {
        const id = (where as any).id_oficina;
        return id === 304
          ? Promise.resolve(mockOficina)
          : Promise.resolve(null);
      });
      repo.merge.mockImplementation((entity, data) =>
        Object.assign(entity, data),
      );
      repo.save.mockResolvedValue({ ...mockOficina, ...updateDto });
      repo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(304, updateDto);

      expect(repo.merge).toHaveBeenCalledWith(mockOficina, updateDto);
      expect(repo.save).toHaveBeenCalledWith(mockOficina);
      expect(result.nombre_cuo).toBe('Oficina actualizada');
    });

    it('Error si la oficina no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(17899, { nombre_cuo: 'Nueva' }),
      ).rejects.toThrow(new NotFoundException('Oficina no encontrada'));
    });
  });

  describe('activate', () => {
    it('Activar una oficina', async () => {
      repo.findOneBy.mockImplementation((where) => {
        const id = (where as any).id_oficina;
        return id === 304
          ? Promise.resolve(mockOficina)
          : Promise.resolve(null);
      });
      repo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.activate(304);

      expect(result).toEqual({ message: 'Oficina activada correctamente' });
    });

    it('Error si la oficina no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.activate(17899)).rejects.toThrow(
        new NotFoundException('La oficina con id 17899 no existe.'),
      );
    });
  });

  describe('deactivate', () => {
    it('Desactivar una oficina', async () => {
      repo.findOneBy.mockImplementation((where) => {
        const id = (where as any).id_oficina;
        return id === 304
          ? Promise.resolve(mockOficina)
          : Promise.resolve(null);
      });
      repo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.deactivate(304);

      expect(result).toEqual({ message: 'Oficina desactivada correctamente' });
    });

    it('Error si la oficina no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.deactivate(17899)).rejects.toThrow(
        new NotFoundException('La oficina con id 17899 no existe.'),
      );
    });
  });
});
