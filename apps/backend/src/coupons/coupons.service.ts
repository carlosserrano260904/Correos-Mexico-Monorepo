import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatedCoupon, CouponStatus } from './entities/created-coupon.entity';
import { GiftedCoupon } from './entities/gifted-coupon.entity';
import { CreateCreatedCouponDto } from './dto/create-created-coupon.dto';
import { CreateGiftedCouponDto } from './dto/create-gifted-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { EditCouponDto } from './dto/edit-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CreatedCoupon)
    private readonly createdRepo: Repository<CreatedCoupon>,

    @InjectRepository(GiftedCoupon)
    private readonly giftedRepo: Repository<GiftedCoupon>,
  ) {}

  // List all created coupons (admin)
  async getAllCoupons(): Promise<Partial<CreatedCoupon>[]> {
    return this.createdRepo.find();
  }

  async getCouponsBySeller(idSeller: number): Promise<CreatedCoupon[]> {
    return this.createdRepo.find({ 
      where: { seller_id: idSeller } 
    });
  }

  async getProductsByCoupon(idCoupon: number): Promise<string[]> {
    const coupon = await this.createdRepo.findOne({ where: { id: idCoupon } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon.product_id ? [coupon.product_id] : [];
  }

  async getUsersByCoupon(idCoupon: number): Promise<GiftedCoupon[]> {
    return this.giftedRepo.find({ where: { coupon_id: idCoupon } });
  }

  async getCouponHistory(idCoupon: number): Promise<GiftedCoupon[]> {
    return this.giftedRepo.find({ where: { coupon_id: idCoupon }, order: { used_at: 'DESC' } });
  }

  async getCouponsByUser(idUser: number): Promise<CreatedCoupon[]> {
  const gifted = await this.giftedRepo.find({
    where: { user_id: idUser },
    relations: ['coupon'],
  });

  // Filtra y asegura el tipo
  const coupons = gifted
    .map((g) => g.coupon)
    .filter((c): c is CreatedCoupon => c !== null && c !== undefined);

  return coupons;
  }

  // Create coupon (seller)
  async createCoupon(dto: CreateCreatedCouponDto): Promise<CreatedCoupon> {
  const coupon = new CreatedCoupon();
  coupon.code = dto.code;
  coupon.type_discount = dto.type_discount;
  coupon.amount = dto.amount;
  coupon.status = CouponStatus.ACTIVE;
  
  if (dto.product_id !== undefined) coupon.product_id = dto.product_id;
  if (dto.seller_id !== undefined) coupon.seller_id = dto.seller_id;
  if (dto.start_at !== undefined) coupon.start_at = new Date(dto.start_at);
  if (dto.expires_at !== undefined) coupon.expires_at = new Date(dto.expires_at);
  if (dto.color !== undefined) coupon.color = dto.color;

  await this.createdRepo.save(coupon);
  return coupon;
}

  // Assign coupon to user (gift)
  async assignCouponToUser(dto: CreateGiftedCouponDto): Promise<GiftedCoupon> {
  const coupon = await this.createdRepo.findOne({ where: { id: dto.coupon_id } });
  if (!coupon) throw new NotFoundException('Coupon not found');

  // Si el coupon no tiene product_id, no podemos asignarlo
  if (!coupon.product_id) {
    throw new BadRequestException('Coupon does not have a product assigned');
  }

  const already = await this.giftedRepo.findOne({ 
    where: { coupon_id: dto.coupon_id, user_id: dto.user_id } 
  });
  if (already) throw new BadRequestException('User already has this coupon');

  const gift = this.giftedRepo.create({
    coupon_id: dto.coupon_id,
    user_id: dto.user_id,
    product_id: dto.product_id ?? coupon.product_id, // Usa el del coupon si no se proporciona
  });

  await this.giftedRepo.save(gift);
  return gift;
}

  // Assign or change product on coupon
  async assignProductToCoupon(idCoupon: number, idProduct: string): Promise<CreatedCoupon> {
    const coupon = await this.createdRepo.findOne({ where: { id: idCoupon } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    coupon.product_id = idProduct;
    await this.createdRepo.save(coupon);
    return coupon;
  }

  // Edit coupon
  async editCoupon(idCoupon: number, dto: EditCouponDto): Promise<CreatedCoupon> {
    const coupon = await this.createdRepo.findOne({ where: { id: idCoupon } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    if (dto.code !== undefined) coupon.code = dto.code;
    if (dto.type_discount !== undefined) coupon.type_discount = dto.type_discount;
    if (dto.amount !== undefined) coupon.amount = dto.amount;
    if (dto.start_at !== undefined) coupon.start_at = new Date(dto.start_at);
    if (dto.expires_at !== undefined) coupon.expires_at = new Date(dto.expires_at);
    if (dto.color !== undefined) coupon.color = dto.color;
    if (dto.status !== undefined) coupon.status = dto.status;

    coupon.updated_at = new Date();
    await this.createdRepo.save(coupon);
    return coupon;
  }

  async pauseCoupon(idCoupon: number): Promise<CreatedCoupon> {
    const coupon = await this.createdRepo.findOne({ where: { id: idCoupon } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    coupon.status = CouponStatus.PAUSED;
    coupon.updated_at = new Date();
    await this.createdRepo.save(coupon);
    return coupon;
  }

  async activateCoupon(idCoupon: number): Promise<CreatedCoupon> {
    const coupon = await this.createdRepo.findOne({ where: { id: idCoupon } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    coupon.status = CouponStatus.ACTIVE;
    coupon.updated_at = new Date();
    await this.createdRepo.save(coupon);
    return coupon;
  }

  async expireCoupon(idCoupon: number): Promise<CreatedCoupon> {
    const coupon = await this.createdRepo.findOne({ where: { id: idCoupon } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    coupon.status = CouponStatus.EXPIRED;
    coupon.updated_at = new Date();
    await this.createdRepo.save(coupon);
    return coupon;
  }

  /**
   * applyCoupon -> use when buyer attempts to use coupon for a purchase
   *
   * Steps:
   *  1) find latest active coupon for product
   *  2) check status & date validity
   *  3) verify buyer hasn't used it before (gifted_coupons)
   *  4) save a gifted_coupons record (used)
   *  5) return discount info
   */
  async applyCoupon(dto: ApplyCouponDto) {
    const { product_id, user_id } = dto;

    // 1) find coupon for product (latest active)
    const coupon = await this.createdRepo.findOne({
      where: { product_id },
      order: { created_at: 'DESC' },
    });

    if (!coupon) return null;

    const now = new Date();
    if (coupon.status !== CouponStatus.ACTIVE) return null;
    if (coupon.start_at && coupon.start_at > now) return null;
    if (coupon.expires_at && coupon.expires_at < now) {
      coupon.status = CouponStatus.EXPIRED;
      await this.createdRepo.save(coupon);
      return null;
    }

    // 2) check if user already used this coupon
    const used = await this.giftedRepo.findOne({ where: { coupon_id: coupon.id, user_id } });
    if (used) return null;

    // 3) register usage
    const gift = this.giftedRepo.create({
      coupon_id: coupon.id,
      user_id,
      product_id,
    });
    await this.giftedRepo.save(gift);

    // 4) return discount details
    return {
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type_discount,
      value: Number(coupon.amount),
    };
  }
}
