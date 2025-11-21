import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CheckCouponDto } from './dto/check-coupon.dto';
import { CompleteNameDto } from './dto/comple-name.dto';
import { CompletePasswordDto } from './dto/complete-password.dto';
import { CreateCreateAccountDto } from './dto/create-create-account.dto';
import { UpdateCreateAccountDto } from './dto/update-create-account.dto';

@Controller('create-account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  create(@Body() createCreateAccountDto: CreateCreateAccountDto) {
    return this.createAccountService.create(createCreateAccountDto);
  }

  @Get()
  findAll() {
    return this.createAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createAccountService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreateAccountDto: UpdateCreateAccountDto,
  ) {
    return this.createAccountService.update(+id, updateCreateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createAccountService.remove(+id);
  }

  @Post('/check-coupon')
  checkCoupon(@Body() checkCouponDto: CheckCouponDto) {
    return this.createAccountService.checkCoupon(checkCouponDto.token);
  }

  @Post('/complete-name/:id')
  completeName(
    @Param('id') id: string,
    @Body() completeNameAccountDto: CompleteNameDto,
  ) {
    return this.createAccountService.completeName(+id, completeNameAccountDto);
  }

  @Post('/complete-password/:id')
  completePassword(
    @Param('id') id: string,
    @Body() completePasswordAccountDto: CompletePasswordDto,
  ) {
    return this.createAccountService.completePassword(
      +id,
      completePasswordAccountDto,
    );
  }
}
