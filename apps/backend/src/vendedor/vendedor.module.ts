import { Module } from '@nestjs/common';
import { VendedorController } from './vendedor.controller';
import { VendedorService } from './vendedor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';

@Module({
  controllers: [VendedorController],
  providers: [VendedorService],
  imports: [TypeOrmModule.forFeature([Solicitud])],
})
export class VendedorModule {}
