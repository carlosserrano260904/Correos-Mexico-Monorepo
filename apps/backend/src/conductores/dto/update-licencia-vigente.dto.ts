import { IsBoolean } from 'class-validator';

export class UpdateLicenciaVigenteDto {
  @IsBoolean()
  licenciaVigente: boolean;
}
