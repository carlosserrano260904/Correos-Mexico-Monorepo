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

        // Guardar perfil por defecto
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

        // Crea el usuario con el perfil relacionado y la contraseña hasheada
        const user = await this.usuariosService.create({
            nombre: dto.nombre || dto.correo.split('@')[0],
            correo: dto.correo,
            password: hash, // ✅ Aquí está la corrección
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

    async oauth(dto: OAuthDto) {
        let proveedor = await this.proveedoresService.findBySub(dto.sub);
        let user;

        if (!proveedor) {
            user = await this.usuariosService.create({
                nombre: dto.nombre,
                correo: dto.correo,
                password: '',
                rol: 'usuario',
            });

            proveedor = await this.proveedoresService.create({
                proveedor: dto.proveedor,
                sub: dto.sub,
                id_usuario: user.id,
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
        let user = await this.usuariosService.findByCorreo(dto.correo);
        if (!user || !user.password) throw new UnauthorizedException();
        if (!user.profile) {
            throw new InternalServerErrorException('El perfil no está vinculado al usuario');
        }

        const valid = await bcrypt.compare(dto.contrasena, user.password);
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
        await this.usuariosService.updateOTP(dto.correo, otp.toString());

            const nodemailer = require('nodemailer');
            
            // Generar cuenta de prueba de Ethereal automáticamente
            const testAccount = await nodemailer.createTestAccount();
            console.log('Generated test account:', testAccount);

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST, // smtp.gmail.com
                port: parseInt(process.env.SMTP_PORT || '587'), // 587
                secure: false, // use STARTTLS
                auth: {
                    user: process.env.SMTP_USER, // juandiego6290@gmail.com
                    pass: process.env.SMTP_PASS, // zplx mggs abmr blnt (App Password)
                },
            });

            // Enviar email
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
                previewUrl: nodemailer.getTestMessageUrl(info) // Para debug
            };
        
    }

    async verifyOtp(dto: VerifyOtpDto) {    
        let isOtpVerified = false;
        const user = await this.usuariosService.findByCorreo(dto.correo);
        
        if (!user) throw new UnauthorizedException('Usuario no encontrado');
        if (user.token === dto.token) {
            await this.usuariosService.updateConfirmado(user.correo, true);
            isOtpVerified = true;
        } 
        return { isOtpVerified };
    }
}
