import { Controller, Get, Param } from '@nestjs/common';
import { PostalService } from './postal.service';

@Controller('postal')
export class PostalController {
  constructor(private readonly postalService: PostalService) {}

  @Get(':codigo')
  getCodigoPostal(@Param('codigo') codigo: string) {
    return this.postalService.findByCodigo(codigo);
  }
}
