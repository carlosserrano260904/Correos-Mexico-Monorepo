import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { AuthController } from './auth.controller';
import { UserModule } from '../usuarios/user.module';
import { ProveedoresModule } from '../proveedores/proveedores.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../enviar-correos/enviar-correos.module';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
    UserModule,
    ProveedoresModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
