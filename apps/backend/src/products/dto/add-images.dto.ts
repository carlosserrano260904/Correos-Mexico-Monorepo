// add-images.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddImagesDto {
  @ApiPropertyOptional({
    description:
      'Orden opcional de cada imagen (paralelo a la lista de archivos)',
    type: [Number],
    example: [0, 1, 2],
  })
  ordenes?: number[];
}
