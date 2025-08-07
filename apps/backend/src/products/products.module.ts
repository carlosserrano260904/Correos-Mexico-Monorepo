import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UploadImageModule } from 'src/upload-image/upload-image.module';
import { UploadGcsModule } from 'src/cloud-storage/upload-gcs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UploadImageModule, UploadGcsModule,], 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
