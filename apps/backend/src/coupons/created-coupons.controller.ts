import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCreatedCouponDto } from './dto/create-created-coupon.dto';
import { EditCouponDto } from './dto/edit-coupon.dto';

@Controller('coupons/created')
export class CreatedCouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // Crear cupón
  @Post()
  create(@Body() dto: CreateCreatedCouponDto) {
    return this.couponsService.createCoupon(dto);
  }

  // Obtener TODOS los cupones
  @Get()
  findAll() {
    return this.couponsService.getAllCoupons();
  }

  // Obtener cupones por vendedor
  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId') sellerId: number) {
    return this.couponsService.getCouponsBySeller(sellerId);
  }

  // Obtener UN cupón por ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const all = await this.couponsService.getAllCoupons();
    return all.find((c) => c.id === id);
  }

  // Editar cupón
  @Patch(':id')
  edit(@Param('id') id: number, @Body() dto: EditCouponDto) {
    return this.couponsService.editCoupon(id, dto);
  }

  // Pausar cupón
  @Patch(':id/pause')
  pause(@Param('id') id: number) {
    return this.couponsService.pauseCoupon(id);
  }

  // Activar cupón
  @Patch(':id/activate')
  activate(@Param('id') id: number) {
    return this.couponsService.activateCoupon(id);
  }

  // Expirar cupón manualmente
  @Patch(':id/expire')
  expire(@Param('id') id: number) {
    return this.couponsService.expireCoupon(id);
  }

  // Asignar producto
  @Patch(':id/product/:productId')
  assignProduct(
    @Param('id') idCoupon: number,
    @Param('productId') idProduct: string,
  ) {
    return this.couponsService.assignProductToCoupon(idCoupon, idProduct);
  }

  // Obtener el historial (usuarios que lo usaron)
  @Get(':id/history')
  history(@Param('id') id: number) {
    return this.couponsService.getCouponHistory(id);
  }
}
