import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoritoDto } from './create-favorito.dto';

export class UpdateFavoritoDto extends PartialType(CreateFavoritoDto) {}
