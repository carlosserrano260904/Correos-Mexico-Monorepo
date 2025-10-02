import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UploadImageModule } from '../upload-image/upload-image.module'; // Import the UploadImageModule
import { ProductImage } from './entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,ProductImage]), UploadImageModule], 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
