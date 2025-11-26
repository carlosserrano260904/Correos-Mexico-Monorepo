import { validate } from 'class-validator';
import { AgregarClaveZonaDto } from '../dto/agregar-clave-zona.dto';
import { EliminarClaveZonaDto } from '../dto/eliminar-clave-zona.dto';

describe('Validaciones', () => {
  describe('AgregarClaveZonaDto', () => {
    it('Error si claveZona no tiene 5 caracteres', async () => {
      const dto = new AgregarClaveZonaDto();
      dto.claveZona = '1234'; //inválido, porque tiene 4 numeros
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isLength');
    });

    it('Error si claveZona tiene letras', async () => {
      const dto = new AgregarClaveZonaDto();
      dto.claveZona = '12a45'; //inválido, porque tiene 1 letra
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('Correcto con claveZona válida', async () => {
      const dto = new AgregarClaveZonaDto();
      dto.claveZona = '12345'; //válido
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('EliminarClaveZonaDto', () => {
    it('falla si claveZona está vacío', async () => {
      const dto = new EliminarClaveZonaDto();
      dto.claveZona = ''; //inválido, porque está vacío
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('Correcto con claveZona válida', async () => {
      const dto = new EliminarClaveZonaDto();
      dto.claveZona = '54321'; // válido
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
