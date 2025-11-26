import { IsString } from 'class-validator';

export class CrearQRDto {
  @IsString()
  numeroDeRastreo: string;
  @IsString()
  idSucursal: string;
  @IsString()
  idRuta: string;
  @IsString()
  estado: string;
  @IsString()
  localizacion: string;
}
