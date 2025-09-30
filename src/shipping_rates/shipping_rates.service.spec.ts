import { Test, TestingModule } from '@nestjs/testing'; // Importa utilidades para pruebas unitarias en NestJS
import { ShippingRatesService } from './shipping_rates.service'; // Importa el servicio a probar

// Define el bloque de pruebas para ShippingRatesService
describe('ShippingRatesService', () => {
  let service: ShippingRatesService; // Variable para almacenar la instancia del servicio

  // Antes de cada prueba, configura el módulo de pruebas y obtiene el servicio
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingRatesService], // Declara el servicio a probar
    }).compile();

    service = module.get<ShippingRatesService>(ShippingRatesService); // Obtiene la instancia del servicio
  });

  // Prueba que el servicio esté definido correctamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
