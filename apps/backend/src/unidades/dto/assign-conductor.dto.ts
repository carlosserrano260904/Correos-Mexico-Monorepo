import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignConductorDto {
  @ApiProperty({ example: 'LOMM850505MDFRRT02' })
  @IsString()
  @IsNotEmpty()
  curpConductor: string;
}
