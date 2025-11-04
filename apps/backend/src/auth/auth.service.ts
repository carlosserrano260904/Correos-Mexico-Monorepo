// Archivo: apps/backend/src/auth/auth.service.ts

import Stripe from 'stripe';
import { Injectable, InternalServerErrorException, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../usuarios/user.service'; // Este servicio maneja CreateAccount
import { ProveedoresService } from '../proveedores/proveedores.service';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';
import { Profile } from 'src/profile/entities/profile.entity'; // Se asume necesaria por CreateAccount
import { DeletionReason } from '../usuarios/entities/deletion-reason.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { OAuthDto } from './dto/oauth.dto';
import { AuthDto } from './dto/auth.dto';
import { UpdatePasswordDto, EmailOtpDto, VerifyOtpDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(DeletionReason)
    private readonly reasonRepository: Repository<DeletionReason>,
    private readonly jwtService: JwtService,
    private readonly usuariosService: UserService,
    private readonly proveedoresService: ProveedoresService,
    private readonly enviarCorreosService: EnviarCorreosService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-08-27.basil', // Asegúrate que esta sea la versión correcta
    });
  }

  private async createStripeCustomer(name?: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      name: name || 'cliente',
    });
  }

  async signup(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.contrasena, 10);
    const userExists = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
    if (userExists) { throw new UnauthorizedException('El correo ya está en uso'); }

    const customer = await this.createStripeCustomer(dto.nombre || dto.correo.split('@')[0]);
    const profile = this.profileRepository.create({
      nombre: dto.nombre || dto.correo.split('@')[0], apellido: '', numero: '', estado: '', ciudad: '', fraccionamiento: '', calle: '', codigoPostal: '', stripeCustomerId: customer.id,
    });
    await this.profileRepository.save(profile);
    const user = await this.usuariosService.create({
      nombre: dto.nombre || dto.correo.split('@')[0], correo: dto.correo, password: hash, rol: 'usuario', profile: profile,
    });
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usuariosService.updateOTP(dto.correo, {
      token: verificationToken, tokenCreatedAt: new Date(),
    });
    await this.enviarCorreosService.enviarConfirmacion({
      correo: user.correo, token: verificationToken, nombre: user.nombre
    });
    const token = await this.jwtService.signAsync({
      profileId: user.profile.id, rol: 'usuario',
    });
    return { token, id: user.id, userId: user.profile.id };
  }

  async oauth(dto: OAuthDto) {
     this.logger.warn('Método OAuth necesita revisión detallada.');
     throw new InternalServerErrorException('Funcionalidad OAuth no verificada.');
  }

  async signin(dto: AuthDto) {
    const user = await this.usuariosService.findByCorreo(dto.correo);

    if (!user || !user.password || user.password === 'N/A: OAuth') {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // --- VERIFICACIÓN 'isActive' ---
    if (user.isActive === false) {
      throw new UnauthorizedException('Esta cuenta ha sido desactivada.');
    }
    // --- Fin Verificación ---

    if (user.confirmado === false) {
      throw new UnauthorizedException('Usuario no verificado');
    }
    if (!user.profile) {
      throw new InternalServerErrorException('El perfil no está vinculado al usuario');
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
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
    if (!user) { throw new UnauthorizedException('Usuario no encontrado'); }
    if (user.tokenCreatedAt) {
      const now = new Date();
      const tokenExpiration = new Date(user.tokenCreatedAt.getTime() + 10 * 60 * 1000);
      if (now > tokenExpiration) {
        // await this.cleanSingleExpiredToken(user.correo); // Revisa si cleanSingleExpiredToken existe
        throw new UnauthorizedException('El token ha expirado');
      }
    }
    if (user.token === dto.token) {
      await this.usuariosService.updateOTP(user.correo, {
        token: null, tokenCreatedAt: null, confirmado: true,
      });
      return { isOtpVerified: true };
    }
    return { isOtpVerified: false };
  }

  // --- 👇 MÉTODO 'deleteUserAccount' AÑADIDO ---
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
  }
} // <-- ¡Asegúrate de que esta sea la última llave del archivo!