import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UploadImageModule } from '../upload-image/upload-image.module'; // Import the UploadImageModule
import { ProductImage } from './entities/productImage.entity';
import { ProductVariant } from './entities/productVariant.entity';
import { ProductAttributeValue } from './entities/productAttributeValue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,ProductImage,ProductVariant, ProductAttributeValue]), UploadImageModule], 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
