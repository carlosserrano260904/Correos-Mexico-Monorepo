// Archivo: apps/backend/src/auth/auth.controller.ts

import { Controller, Post, Body, UseGuards, Get, Req, Put, Delete, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto'; // Ruta corregida
import { OAuthDto } from './dto/oauth.dto';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdatePasswordDto, EmailOtpDto, VerifyOtpDto } from './dto/update-password.dto';
import { ExtractJwt } from 'passport-jwt'; // Importación necesaria para el parche

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        // JwtService sigue comentado en el constructor para evitar el 404
    ) {
        console.log("<<<<< AuthController CARGADO >>>>>");
    }

    @Post('signup')
    signup(@Body() dto: CreateUserDto) {
        return this.authService.signup(dto);
    }

    @Post('oauth')
    oauth(@Body() dto: OAuthDto) {
        return this.authService.oauth(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }

    @Put('update-password')
    updatePassword(@Body() dto: UpdatePasswordDto) {
        return this.authService.updatePassword(dto);
    }

    @Post('email-otp')
    emailOtp(@Body() dto: EmailOtpDto) {
        return this.authService.emailOtp(dto);
    }

    @Post('verify-otp')
    verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req: Request & { user?: any }) {
        return req.user;
    }

    // --- 👇 MÉTODO DELETEACCOUNT RESTAURADO CON PARCHE LOCAL ---
    @Delete('delete-account')
    @UseGuards(JwtAuthGuard) // El guard sigue protegiendo la ruta
    async deleteAccount(
        @Req() req: Request,
        @Body() body: { 
            password: string, 
            selectedOption: string, 
            otherText?: string 
        }
    ) {
        // 1. Extraer el token del encabezado
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
            throw new UnauthorizedException('No se encontró token de autorización.');
        }

        let userIdFromPayload: number | undefined;

        try {
            // 2. Importación dinámica y creación manual de JwtService
             const { JwtService } = await import('@nestjs/jwt');
             const jwtServiceInstance = new JwtService({ secret: process.env.JWT_SECRET || 'secret' });

            // 3. Verificar y decodificar
            const payload = jwtServiceInstance.verify(token, {
                secret: process.env.JWT_SECRET || 'secret'
            });

            // 4. Extraer el profileId
            userIdFromPayload = payload.profileId;

            // 5. Verificar que sea número
            if (typeof userIdFromPayload !== 'number') {
                throw new Error('profileId no encontrado o no es numérico.');
            }

        } catch (error) {
            console.error("Error al verificar token en deleteAccount:", error);
            throw new UnauthorizedException('Token inválido o expirado.');
        }
        
        // 6. Llamar al servicio con todos los datos
        return this.authService.deleteUserAccount(
            userIdFromPayload, 
            body.password, 
            body.selectedOption,
            body.otherText || null
        ); 
    }
    // --- FIN MÉTODO RESTAURADO ---

} // Fin AuthController