// Archivo: apps/backend/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy'; // Asegúrate que el nombre "startegy" sea correcto
import { AuthController } from './auth.controller';
import { UserModule } from '../usuarios/user.module'; // Importa el módulo de usuarios
import { ProveedoresModule } from '../proveedores/proveedores.module';
import { Profile } from 'src/profile/entities/profile.entity';
import { EmailModule } from '../enviar-correos/enviar-correos.module';
import { DeletionReason } from '../usuarios/entities/deletion-reason.entity';
@Module({
  imports: [
    // Registra Profile y DeletionReason para inyección
    TypeOrmModule.forFeature([Profile, DeletionReason]), 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
    UserModule, // Importa UserModule para que AuthService pueda usar UserService
    ProveedoresModule,
    EmailModule,
  ],
  controllers: [AuthController], // Declara el controlador de este módulo
  providers: [AuthService, JwtStrategy], // Declara los servicios y estrategias
  exports: [AuthService],
})
export class AuthModule {}