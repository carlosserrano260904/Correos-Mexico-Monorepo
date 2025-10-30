// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../usuarios/entities/user.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User]) // Importa la entidad Usuario
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}