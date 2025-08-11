import { Test, TestingModule } from '@nestjs/testing'; // Importa utilidades para pruebas unitarias en NestJS
import { ShippingRatesController } from './shipping_rates.controller'; // Importa el controlador a probar
import { ShippingRatesService } from './shipping_rates.service'; // Importa el servicio usado por el controlador

// Define el bloque de pruebas para ShippingRatesController
describe('ShippingRatesController', () => {
  let controller: ShippingRatesController; // Variable para almacenar la instancia del controlador

  // Antes de cada prueba, configura el módulo de pruebas y obtiene el controlador
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingRatesController], // Declara el controlador a probar
      providers: [ShippingRatesService], // Declara el servicio necesario para el controlador
    }).compile();

    controller = module.get<ShippingRatesController>(ShippingRatesController); // Obtiene la instancia del controlador
  });

  // Prueba que el controlador esté definido correctamente
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
