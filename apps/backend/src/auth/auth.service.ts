import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../usuarios/user.service';
import { ProveedoresService } from '../proveedores/proveedores.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OAuthDto } from './dto/oauth.dto';
import { AuthDto } from './dto/auth.dto';
import { UpdatePasswordDto, EmailOtpDto, VerifyOtpDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        private jwtService: JwtService,
        private usuariosService: UserService,
        private proveedoresService: ProveedoresService,
    ) { }

    async signup(dto: CreateUserDto) {
        const hash = await bcrypt.hash(dto.contrasena, 10);
        const userExists = await this.usuariosService.findByCorreoNoOAuth(dto.correo);
        console.log('userExists', userExists);
        if (userExists) {
            throw new UnauthorizedException('El correo ya está en uso');
        } else {
            const Stripe = require('stripe');
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
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

            const user = await this.usuariosService.create({
                nombre: dto.nombre || dto.correo.split('@')[0],
                correo: dto.correo,
                password: hash,
                rol: 'usuario',
                profile,
            });

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
    }

    async oauth(dto: OAuthDto) {
        console.log('[oauth] dto:', dto)
        let proveedor = await this.proveedoresService.findBySub(dto.sub);
        let user;

        if (!proveedor) {
            const profile = this.profileRepository.create({
                nombre: dto.nombre || dto.correo.split('@')[0],
                apellido: '',
                numero: '',
                estado: '',
                ciudad: '',
                fraccionamiento: '',
                calle: '',
                codigoPostal: '',
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
                id_usuario: user.profile.id,
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
        console.log('DTO recibido:', dto);
        let user = await this.usuariosService.findByCorreo(dto.correo);
        console.log('Usuario encontrado:', user);
        if (!user || !user.password) throw new UnauthorizedException();
        if (!user.profile) {
            throw new InternalServerErrorException('El perfil no está vinculado al usuario');
        }

        const valid = await bcrypt.compare(dto.contrasena, user.password);
        console.log('Resultado bcrypt.compare:', valid);
        if (!valid) throw new UnauthorizedException();

        const token = await this.jwtService.signAsync({
            profileId: user.profile.id,
            rol: user.rol || 'usuario'
        });

        return { token, userId: user.profile.id };
    }

    async updatePassword(dto: UpdatePasswordDto) {
        const user = await this.usuariosService.findByCorreo(dto.correo);
        if (!user) throw new UnauthorizedException('Usuario no encontrado');

        const hash = await bcrypt.hash(dto.contrasena, 10);
        const result = await this.usuariosService.update(dto.correo, hash);

        if (result.affected === 0) {
            throw new UnauthorizedException('No se pudo actualizar la contraseña');
        }

        return { message: 'Contraseña actualizada exitosamente' };
    }

    async emailOtp(dto: EmailOtpDto) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const user = await this.usuariosService.findByCorreo(dto.correo);
        console.log("user: ", user)
        if (!user) throw new UnauthorizedException('Usuario no encontrado');

        await this.usuariosService.updateOTP(dto.correo, {
            token: otp.toString(),
            tokenCreatedAt: new Date()
        });

        const nodemailer = require('nodemailer');
        const testAccount = await nodemailer.createTestAccount();
        console.log('Generated test account:', testAccount);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"Correos México" <noreply@correos.com>',
            to: dto.correo,
            subject: "Código de verificación - Correos México",
            text: `Tu código de verificación es: ${otp}`,
            html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Código de verificación</h2>
                        <p>Tu código de verificación es:</p>
                        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                            ${otp}
                        </div>
                        <p>Este código expirará en 10 minutos.</p>
                        <p>Si no solicitaste este código, puedes ignorar este email.</p>
                    </div>
                `,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return {
            message: 'OTP enviado correctamente',
            previewUrl: nodemailer.getTestMessageUrl(info)
        };
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const user = await this.usuariosService.findByCorreo(dto.correo);
        if (!user) throw new UnauthorizedException('Usuario no encontrado');

        // Verificar expiración (10 minutos)
        if (user.tokenCreatedAt) {
            const now = new Date();
            const tokenExpiration = new Date(user.tokenCreatedAt.getTime() + 10 * 60 * 1000);
            
            if (now > tokenExpiration) {
                // Limpiar el token expirado inmediatamente
                await this.cleanSingleExpiredToken(user.correo);
                throw new UnauthorizedException('El token ha expirado');
            }
        }

        if (user.token === dto.token) {
            await this.usuariosService.updateOTP(user.correo, {
                token: null,
                tokenCreatedAt: null,
                confirmado: true
            });
            return { isOtpVerified: true };
        }
        
        return { isOtpVerified: false };
    }

    // Limpiar token individual expirado
    private async cleanSingleExpiredToken(email: string) {
        await this.usuariosService.updateOTP(email, {
            token: null,
            tokenCreatedAt: null
        });
    }

    // Tarea programada para limpiar tokens expirados (cada 5 minutos)
    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCleanExpiredTokens() {
        console.log('Ejecutando limpieza de tokens expirados...');
        try {
            const expirationTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutos atrás
            await this.usuariosService.cleanExpiredTokens();
            console.log('Limpieza de tokens expirados completada');
        } catch (error) {
            console.error('Error en limpieza de tokens expirados:', error);
        }
    }
}