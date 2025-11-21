<<<<<<< HEAD
import { Injectable, InternalServerErrorException, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
=======
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
<<<<<<< HEAD
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule'; // Importado de develop

import { UserService } from '../usuarios/user.service';
import { ProveedoresService } from '../proveedores/proveedores.service';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';
import { Profile } from '../profile/entities/profile.entity'; // Ruta relativa corregida
import { DeletionReason } from '../usuarios/entities/deletion-reason.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { OAuthDto } from './dto/oauth.dto';
import { AuthDto } from './dto/auth.dto';
import { UpdatePasswordDto, EmailOtpDto, VerifyOtpDto } from './dto/update-password.dto';
=======
import { Repository } from 'typeorm';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';
import { Profile } from '../profile/entities/profile.entity';
import { ProveedoresService } from '../proveedores/proveedores.service';
import { UserService } from '../usuarios/user.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { OAuthDto } from './dto/oauth.dto';
import {
  EmailOtpDto,
  UpdatePasswordDto,
  VerifyOtpDto,
} from './dto/update-password.dto';
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(DeletionReason)
    private readonly reasonRepository: Repository<DeletionReason>,
    private readonly jwtService: JwtService,
    private readonly usuariosService: UserService,
    private readonly proveedoresService: ProveedoresService,
    private readonly enviarCorreosService: EnviarCorreosService,
  ) {}

  async signup(dto: CreateUserDto) {
    // Lógica combinada: Hash password + Stripe + Perfil + Usuario + Token
    let hash = '';
    if (dto.contrasena) {
      hash = await bcrypt.hash(dto.contrasena, 10);
    }

    const userExists = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
<<<<<<< HEAD
=======

>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
    if (userExists) {
      throw new UnauthorizedException('El correo ya está en uso');
    }

    // Stripe
    const Stripe = require('stripe');
<<<<<<< HEAD
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { 
      apiVersion: '2023-10-16' 
=======
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
    });
    const customer = await stripe.customers.create({
      name: dto.nombre || dto.correo.split('@')[0],
      email: dto.correo,
    });

<<<<<<< HEAD
=======
    // Creación de perfil
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
    const profile = this.profileRepository.create({
      nombre: dto.nombre || dto.correo.split('@')[0],
      apellido: '', numero: '', estado: '', ciudad: '', fraccionamiento: '', calle: '', codigoPostal: '', 
      stripeCustomerId: customer.id,
    });

    const user = await this.usuariosService.create({
      nombre: dto.nombre || dto.correo.split('@')[0],
      correo: dto.correo,
      password: hash, // Puede ir vacío si vino de un flujo sin pass
      rol: 'usuario',
      profile,
    });

<<<<<<< HEAD
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usuariosService.updateOTP(dto.correo, {
      token: verificationToken,
      tokenCreatedAt: new Date()
    });

    try {
      await this.enviarCorreosService.enviarConfirmacion({
        correo: user.correo,
        token: verificationToken,
        nombre: user.nombre
      });
    } catch (error) {
      this.logger.error(`Error enviando correo a ${user.correo}`, error);
    }
=======
    // Generar y enviar token de verificación
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    await this.usuariosService.updateOTP(dto.correo, {
      token: verificationToken,
      tokenCreatedAt: new Date(),
    });

    // Enviar email de confirmación
    await this.enviarCorreosService.enviarConfirmacion({
      correo: user.correo,
      token: verificationToken,
      nombre: user.nombre,
    });
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b

    const token = await this.jwtService.signAsync({
      profileId: user.profile.id,
      rol: 'usuario',
    });

    return {
      token,
      id: user.id,
      userId: user.profile.id,
    };
  }

  async oauth(dto: OAuthDto) {
    this.logger.log(`Procesando OAuth para: ${dto.correo}`);
    let proveedor = await this.proveedoresService.findBySub(dto.sub);
    let user;

    if (!proveedor) {
      const Stripe = require('stripe');
<<<<<<< HEAD
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
=======
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-06-30.basil',
      });
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
      const customer = await stripe.customers.create({
        name: dto.nombre || dto.correo.split('@')[0],
        email: dto.correo,
      });

      const profile = this.profileRepository.create({
        nombre: dto.nombre || dto.correo.split('@')[0],
        apellido: '', numero: '', estado: '', ciudad: '', fraccionamiento: '', calle: '', codigoPostal: '', 
        stripeCustomerId: customer.id,
      });

      user = await this.usuariosService.create({
        nombre: dto.nombre || dto.correo.split('@')[0],
        correo: dto.correo,
        password: 'N/A: OAuth',
        rol: 'usuario',
        confirmado: true,
        profile,
      });

      proveedor = await this.proveedoresService.create({
        proveedor: dto.proveedor,
        sub: dto.sub,
        id_usuario: user.id,
        correo_asociado: dto.correo,
      });
    } else {
      user = await this.usuariosService.findById(proveedor.id_usuario);
    }

    const token = await this.jwtService.signAsync({
      profileId: user.profile.id,
      rol: user.rol || 'usuario',
    });

    return { token };
  }

  async signin(dto: AuthDto) {
    const user = await this.usuariosService.findByCorreo(dto.correo);

<<<<<<< HEAD
    if (!user || !user.password || user.password === 'N/A: OAuth') {
=======
    if (!user || !user.password) {
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // --- VERIFICACIÓN 'isActive' (Tu funcionalidad) ---
    if (user.isActive === false) {
      throw new UnauthorizedException('Esta cuenta ha sido desactivada.');
    }
    // -------------------------------------------------

    if (user.confirmado === false) {
      throw new UnauthorizedException('Usuario no verificado');
    }
    if (!user.profile) {
      throw new InternalServerErrorException(
        'El perfil no está vinculado al usuario',
      );
    }

    const valid = await bcrypt.compare(dto.contrasena, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = await this.jwtService.signAsync({
      profileId: user.profile.id,
      rol: user.rol || 'usuario',
    });

    return { token, userId: user.profile.id };
  }

  async updatePassword(dto: UpdatePasswordDto) {
    const user = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
    if (!user) { throw new UnauthorizedException('Usuario no encontrado'); }
    const hash = await bcrypt.hash(dto.contrasena, 10);
    const result = await this.usuariosService.update(dto.correo, hash); 
    if (result.affected === 0) { throw new UnauthorizedException('No se pudo actualizar la contraseña'); }
    return { message: 'Contraseña actualizada exitosamente' };
  }

  async emailOtp(dto: EmailOtpDto) {
<<<<<<< HEAD
     const user = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
     if (!user) { throw new UnauthorizedException('Usuario no encontrado'); }
     const otp = Math.floor(100000 + Math.random() * 900000);
     await this.usuariosService.updateOTP(dto.correo, {
       token: otp.toString(), tokenCreatedAt: new Date(),
     });
     await this.enviarCorreosService.enviarConfirmacion({
       correo: user.correo, token: otp.toString(), nombre: user.nombre,
     });
     return { message: 'OTP enviado correctamente' };
=======
    const user = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await this.usuariosService.updateOTP(dto.correo, {
      token: otp.toString(),
      tokenCreatedAt: new Date(),
    });

    await this.enviarCorreosService.enviarConfirmacion({
      correo: user.correo,
      token: otp.toString(),
      nombre: user.nombre,
    });

    return { message: 'OTP enviado correctamente' };
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
    if (!user) { throw new UnauthorizedException('Usuario no encontrado'); }
    if (user.tokenCreatedAt) {
      const now = new Date();
<<<<<<< HEAD
      const tokenExpiration = new Date(user.tokenCreatedAt.getTime() + 10 * 60 * 1000);
=======
      const tokenExpiration = new Date(
        user.tokenCreatedAt.getTime() + 10 * 60 * 1000,
      );

>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
      if (now > tokenExpiration) {
        // await this.cleanSingleExpiredToken(user.correo); // Método privado opcional
        throw new UnauthorizedException('El token ha expirado');
      }
    }
    if (user.token === dto.token) {
      await this.usuariosService.updateOTP(user.correo, {
<<<<<<< HEAD
        token: null, tokenCreatedAt: null, confirmado: true,
      });
      return { isOtpVerified: true };
    }
    return { isOtpVerified: false };
  }

  // --- TU MÉTODO 'deleteUserAccount' ---
  async deleteUserAccount(
      profileIdFromToken: number,
      passwordAttempt: string,
      selectedOption: string,
      otherText: string | null
  ): Promise<{ message: string }> {
  
      const user = await this.usuariosService.findByProfileId(profileIdFromToken);
      if (!user) { 
          throw new NotFoundException('Usuario no encontrado usando el profileId del token'); 
      }
  
      const storedHash = user.password; 
      if (!storedHash || storedHash === 'N/A: OAuth') { 
          throw new UnauthorizedException('El usuario no tiene una contraseña configurada para verificar.'); 
      }
  
      const isPasswordValid = await bcrypt.compare(passwordAttempt, storedHash);
      if (!isPasswordValid) { 
          throw new UnauthorizedException('La contraseña es incorrecta'); 
      }
  
      if (selectedOption) {
          try {
              const newReason = this.reasonRepository.create({ 
                  selected_option: selectedOption,
                  other_text: otherText || null
              });
              await this.reasonRepository.save(newReason);
              this.logger.log(`Motivo estructurado guardado (profileId: ${profileIdFromToken})`);
          } catch (error) {
              this.logger.error(`Error al guardar motivo estructurado: ${(error as Error).message}`);
          }
      }
  
      await this.usuariosService.deactivateUser(user.id);
      return { message: 'Cuenta desactivada exitosamente' };
=======
        token: null,
        tokenCreatedAt: null,
        confirmado: true,
      });
      return { isOtpVerified: true };
    }

    // Vi que el frontend solo checa si la respuesta es 'ok' (status 200).
    // Si el token estaba mal, yo regresaba 'false' pero con status 200,
    // así que la app pensaba que estaba bien.
    // Ahora lanzo un error 401 para que el frontend sí lo cache.
    throw new UnauthorizedException('Token no valido');
  }

  private async cleanSingleExpiredToken(email: string) {
    await this.usuariosService.updateOTP(email, {
      token: null,
      tokenCreatedAt: null,
    });
>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
  }

  // Tarea programada de develop (CRON)
  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanUnverifiedUsers() {
    this.logger.log('Iniciando limpieza de usuarios no verificados...');
<<<<<<< HEAD
=======

>>>>>>> a83e1c0a422ac708dd0fc6de7003caf4b174ff5b
    try {
      const deletedCount = await this.usuariosService.cleanUnverifiedUsers();
      this.logger.log(`Usuarios no verificados eliminados: ${deletedCount}`);
    } catch (error) {
      this.logger.error('Error en limpieza de usuarios no verificados:', error.stack);
    }
  }
}