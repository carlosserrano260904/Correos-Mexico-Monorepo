import { Controller, Post, Body, UseGuards, Get, Req, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OAuthDto } from './dto/oauth.dto';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdatePasswordDto, EmailOtpDto, VerifyOtpDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
    me(@Req() req) {
        return req.user;
    }
}