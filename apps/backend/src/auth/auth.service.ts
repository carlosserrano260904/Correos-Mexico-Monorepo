import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private jwtService: JwtService,
    private usuariosService: UserService,
    private proveedoresService: ProveedoresService,
    private readonly enviarCorreosService: EnviarCorreosService,
  ) {}

  async signup(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.contrasena, 10);
    const userExists = await this.usuariosService.findByCorreoNoOAuth(dto.correo);

    if (userExists) {
      throw new UnauthorizedException('El correo ya está en uso');
    }

    // Creación de cliente en Stripe
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    });
    const customer = await stripe.customers.create({
      name: dto.nombre || dto.correo.split('@')[0],
    });

    // Creación de perfil
    const profile = this.profileRepository.create({
      nombre: dto.nombre || dto.correo.split('@')[0],
      apellido: '',
      numero: '',
      estado: '',
      ciudad: '',
      fraccionamiento: '',
      calle: '',
      codigoPostal: '',
      stripeCustomerId: customer.id,
    });

    // Creación de usuario
    const user = await this.usuariosService.create({
      nombre: dto.nombre || dto.correo.split('@')[0],
      correo: dto.correo,
      password: hash,
      rol: 'usuario',
      profile,
    });

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

    // Generar token JWT
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
      // Crear cliente en Stripe
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-06-30.basil',
      });
      const customer = await stripe.customers.create({
        name: dto.nombre || dto.correo.split('@')[0],
      });

      const profile = this.profileRepository.create({
        nombre: dto.nombre || dto.correo.split('@')[0],
        apellido: '',
        numero: '',
        estado: '',
        ciudad: '',
        fraccionamiento: '',
        calle: '',
        codigoPostal: '',
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

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
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
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const hash = await bcrypt.hash(dto.contrasena, 10);
    const result = await this.usuariosService.update(dto.correo, hash);

    if (result.affected === 0) {
      throw new UnauthorizedException('No se pudo actualizar la contraseña');
    }

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async emailOtp(dto: EmailOtpDto) {
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
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar expiración (10 minutos)
    if (user.tokenCreatedAt) {
      const now = new Date();
      const tokenExpiration = new Date(
        user.tokenCreatedAt.getTime() + 10 * 60 * 1000,
      );

      if (now > tokenExpiration) {
        await this.cleanSingleExpiredToken(user.correo);
        throw new UnauthorizedException('El token ha expirado');
      }
    }

    if (user.token === dto.token) {
      await this.usuariosService.updateOTP(user.correo, {
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
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // async handleCleanExpiredTokens() {
  //   this.logger.log('Iniciando limpieza de tokens expirados...');
  //   try {
  //     const cleanedCount = await this.usuariosService.cleanExpiredTokens();
  //     this.logger.log(`Tokens expirados limpiados: ${cleanedCount}`);
  //   } catch (error) {
  //     this.logger.error('Error en limpieza de tokens expirados:', error.stack);
  //   }
  // }

  //@Cron(CronExpression.EVERY_HOUR) // Destruir registros relacionados a usuarios no verificados
  async handleCleanUnverifiedUsers() {
    this.logger.log('Iniciando limpieza de usuarios no verificados...');

    try {
      // Eliminar usuarios no verificados después de 24 horas
      const deletedCount = await this.usuariosService.cleanUnverifiedUsers();
      this.logger.log(`Usuarios no verificados eliminados: ${deletedCount}`);
    } catch (error) {
      this.logger.error('Error en limpieza de usuarios no verificados:', error.stack);
    }
  }
}