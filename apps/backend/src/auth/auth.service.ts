import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../usuarios/user.service';
import { ProveedoresService } from '../proveedores/proveedores.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OAuthDto } from './dto/oauth.dto';
import { AuthDto } from './dto/auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usuariosService: UserService,
        private proveedoresService: ProveedoresService,
    ) { }

    async signup(dto: CreateUserDto) {
        const hash = await bcrypt.hash(dto.contrasena, 10);
        const user = await this.usuariosService.create({
          nombre: dto.nombre || dto.correo.split('@')[0],
          correo: dto.correo,
          contrasena: hash,
          rol: 'usuario',
        });
      
        const token = await this.jwtService.signAsync({
          id: user.id,
          rol: 'usuario',
        });
      
        return {
          token,
          id: user.id,
        };
      }      

    async oauth(dto: OAuthDto) {
        let proveedor = await this.proveedoresService.findBySub(dto.sub);
        let user;

        if (!proveedor) {
            user = await this.usuariosService.create({
                nombre: dto.nombre,
                correo: dto.correo,
                contrasena: null,
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
            id: user.id,
            rol: user.rol || 'usuario',
        });

        return { token };
    }

    async signin(dto: AuthDto) {
        let user = await this.usuariosService.findByCorreo(dto.correo);
        if (!user || !user.password) throw new UnauthorizedException();

        const valid = await bcrypt.compare(dto.contrasena, user.password);
        if (!valid) throw new UnauthorizedException();

        const token = await this.jwtService.signAsync({
            id: user.id,
            rol: user.rol || 'usuario'
        });

        return { token };
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
}