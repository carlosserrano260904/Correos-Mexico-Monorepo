import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';
import { EnviarCorreosService } from 'src/enviar-correos/enviar-correos.service';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login/login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(CreateAccount)
    private readonly loginAccountRepository: Repository<CreateAccount>,
    private readonly emailService: EnviarCorreosService,
  ) {}
  async login(verificaredLoginDto: LoginDto) {
    const { correo } = verificaredLoginDto;
    const user = await this.loginAccountRepository.findOne({
      where: { correo },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const token = user?.token!;
    if (!user?.confirmado) {
      await this.emailService.enviarConfirmacion({
        correo: verificaredLoginDto.correo,
        token,
      });
      throw new BadRequestException('Por favor de verificar la cuenta');
    }
    if (user.password !== verificaredLoginDto.password) {
      throw new BadRequestException('Contraseña incorrecta');
    }
    return {
      ok: true,
      message: 'Usuario autenticado correctamente',
    };
  }
}
