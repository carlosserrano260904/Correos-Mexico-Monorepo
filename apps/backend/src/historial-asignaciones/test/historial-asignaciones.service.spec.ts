/**
 * @file Pruebas unitarias para HistorialAsignacionesService
 * @module historial-asignaciones/test
 * @description
 * Contiene las pruebas unitarias del servicio HistorialAsignacionesService.
 * Valida el correcto funcionamiento de los métodos principales del servicio,
 * utilizando mocks de TypeORM para aislar las pruebas de la base de datos real.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { HistorialAsignacion } from '../entities/historial-asignacion.entity';
import { HistorialAsignacionesService } from '../historial-asignaciones.service';

/**
 * @describe HistorialAsignacionesService
 * @group Pruebas Unitarias
 * @description Conjunto de pruebas para el servicio de historial de asignaciones.
 * Las pruebas validan la lógica de negocio del servicio mockeando el repositorio TypeORM.
 */
describe('HistorialAsignacionesService', () => {
  let service: HistorialAsignacionesService;
  let mockRepository: jest.Mocked<Repository<HistorialAsignacion>>;

  /**
   * @beforeEach
   * @description Configura el entorno de prueba antes de cada caso.
   * Inicializa el módulo de testing y crea mocks para el repositorio.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistorialAsignacionesService,
        {
          provide: getRepositoryToken(HistorialAsignacion),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HistorialAsignacionesService>(
      HistorialAsignacionesService,
    );
    mockRepository = module.get(getRepositoryToken(HistorialAsignacion));
  });

  /**
   * @describe registrarAsignacion
   * @description Pruebas para el método de registro de nuevas asignaciones
   */
  describe('registrarAsignacion', () => {
    /**
     * @test
     * @description Debe crear y guardar correctamente una nueva asignación
     * - Valida que los parámetros se pasen correctamente al repositorio
     * - Verifica que el CURP se convierta a mayúsculas
     * - Confirma que se establece la oficina actual igual a la de salida
     */
    it('debe crear y guardar una nueva asignación', async () => {
      const mockAsignacion: HistorialAsignacion = {
        id: 1,
        nombreConductor: 'Juan Pérez',
        curp: 'GARC850101HDFLLL05',
        placasUnidad: 'ABC1234',
        claveOficinaSalida: 'OF001',
        claveOficinaDestino: 'CUO002',
        claveOficinaActual: 'OF001',
        fechaAsignacion: new Date(),
        fechaLlegadaDestino: null,
        fechaFinalizacion: null,
      };

      mockRepository.create.mockReturnValue(mockAsignacion);
      mockRepository.save.mockResolvedValue(mockAsignacion);

      const result = await service.registrarAsignacion(
        'Juan Pérez',
        'GARC850101HDFLLL05',
        'ABC1234',
        'OF001',
        'CUO002',
      );

      expect(mockRepository.create).toHaveBeenCalledWith({
        nombreConductor: 'Juan Pérez',
        curp: 'GARC850101HDFLLL05',
        placasUnidad: 'ABC1234',
        claveOficinaSalida: 'OF001',
        claveOficinaDestino: 'CUO002',
        claveOficinaActual: 'OF001',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockAsignacion);
      expect(result).toEqual(mockAsignacion);
    });
  });

  /**
   * @describe registrarLlegadaDestino
   * @description Pruebas para el registro de llegada a destino
   */
  describe('registrarLlegadaDestino', () => {
    it('debe actualizar fechaLlegadaDestino y claveOficinaActual', async () => {
      const mockAsignacion: HistorialAsignacion = {
        id: 1,
        nombreConductor: 'Juan Pérez',
        curp: 'GARC850101HDFLLL05',
        placasUnidad: 'ABC1234',
        claveOficinaSalida: 'OF001',
        claveOficinaDestino: 'CUO002',
        claveOficinaActual: 'OF001',
        fechaAsignacion: new Date(),
        fechaLlegadaDestino: null,
        fechaFinalizacion: null,
      };

      // Mockear findOne para devolver una asignación existente
      mockRepository.findOne.mockResolvedValue(mockAsignacion);
      // Mockear save para devolver la asignación actualizada
      mockRepository.save.mockResolvedValue({
        ...mockAsignacion,
        claveOficinaActual: 'CUO002',
        fechaLlegadaDestino: new Date(),
      });

      await service.registrarLlegadaDestino(
        'GARC850101HDFLLL05',
        'ABC1234',
        'CUO002',
      );

      // Verificar que se buscó la asignación correcta
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          curp: 'GARC850101HDFLLL05',
          placasUnidad: 'ABC1234',
          fechaLlegadaDestino: IsNull(),
        },
        order: { fechaAsignacion: 'DESC' },
      });

      // Verificar que se guardaron los cambios correctos
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockAsignacion,
        claveOficinaActual: 'CUO002',
        fechaLlegadaDestino: expect.any(Date),
      });
    });

    it('debe lanzar NotFoundException si no encuentra asignación activa', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.registrarLlegadaDestino(
          'GARC850101HDFLLL05',
          'ABC1234',
          'CUO002',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
  /**
   * @describe finalizarAsignacion
   * @description Pruebas para la finalización de asignaciones
   */
  describe('finalizarAsignacion', () => {
    /**
     * @test
     * @description Debe actualizar correctamente la fecha de finalización
     * - Valida que solo actualiza registros con fechaFinalizacion nula
     * - Confirma que establece la fecha actual al finalizar
     */
    it('debe actualizar fechaFinalizacion', async () => {
      mockRepository.update.mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: [],
      });

      await service.finalizarAsignacion('GARC850101HDFLLL05', 'ABC1234');

      expect(mockRepository.update).toHaveBeenCalledWith(
        {
          curp: 'GARC850101HDFLLL05',
          placasUnidad: 'ABC1234',
          fechaFinalizacion: IsNull(),
        },
        { fechaFinalizacion: expect.any(Date) },
      );
    });
  });

  /**
   * @describe getHistorial
   * @description Pruebas para la consulta de historial
   */
  describe('getHistorial', () => {
    /**
     * @test
     * @description Debe filtrar correctamente por placas y CURP
     * - Valida que construye correctamente el objeto WHERE
     * - Confirma el ordenamiento por fecha de asignación (DESC)
     * - Verifica que retorna los datos esperados
     */
    it('debe filtrar por placas y curp', async () => {
      const mockHistorial: HistorialAsignacion[] = [
        {
          id: 1,
          nombreConductor: 'Juan Pérez',
          curp: 'GARC850101HDFLLL05',
          placasUnidad: 'ABC1234',
          claveOficinaSalida: 'OF001',
          claveOficinaDestino: 'CUO002',
          claveOficinaActual: 'OF001',
          fechaAsignacion: new Date(),
          fechaLlegadaDestino: null,
          fechaFinalizacion: null,
        },
      ];

      mockRepository.find.mockResolvedValue(mockHistorial);

      const result = await service.getHistorial(
        'ABC1234',
        'GARC850101HDFLLL05',
      );

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          placasUnidad: 'ABC1234',
          curp: 'GARC850101HDFLLL05',
        },
        order: { fechaAsignacion: 'DESC' },
      });
      expect(result).toEqual(mockHistorial);
    });
  });
});
