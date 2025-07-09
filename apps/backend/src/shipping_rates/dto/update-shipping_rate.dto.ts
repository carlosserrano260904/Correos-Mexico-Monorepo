import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingRateDto } from './create-shipping_rate.dto';

export class UpdateShippingRateDto extends PartialType(CreateShippingRateDto) {}
