import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateAccountDto } from './create-create-account.dto';

export class UpdateCreateAccountDto extends PartialType(CreateCreateAccountDto) {}
