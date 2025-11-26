import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) return true; // Si no se especifican roles, permitir

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret',
      ); // cambiar por la clave secreta real en producción
      request.user = decoded;

      const userRole = decoded.rol; // Asegúrate que el token tenga ⁠ rol

      if (roles.includes(userRole)) {
        return true;
      } else {
        throw new ForbiddenException('No tienes permisos');
      }
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
