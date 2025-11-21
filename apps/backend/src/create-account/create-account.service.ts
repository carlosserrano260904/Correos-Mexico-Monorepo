import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';
import { generateToken } from '../utils/token';
import { CompleteNameDto } from './dto/comple-name.dto';
import { CompletePasswordDto } from './dto/complete-password.dto';
import { CreateCreateAccountDto } from './dto/create-create-account.dto';
import { UpdateCreateAccountDto } from './dto/update-create-account.dto';
import { CreateAccount } from './entities/create-account.entity';

@Injectable()
export class CreateAccountService {
  constructor(
    @InjectRepository(CreateAccount)
    private readonly createAccountRepository: Repository<CreateAccount>,
    private readonly emailService: EnviarCorreosService,
  ) {}
  async create(createCreateAccountDto: CreateCreateAccountDto) {
    const token = generateToken();
    const user = await this.createAccountRepository.save({
      ...createCreateAccountDto,
      token,
    });

    // Forzamos que el usuario inicie como no confirmado
    user.confirmado = false;
    await this.createAccountRepository.save(user);

    await this.emailService.enviarConfirmacion({
      correo: createCreateAccountDto.correo,
      token,
    });
    return {
      message:
        'Se ha enviado un codigo de verificacion, por favor de checar tu email',
      ok: true,
    };
  }

  findAll() {
    return `This action returns all createAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} createAccount`;
  }

  update(id: number, updateCreateAccountDto: UpdateCreateAccountDto) {
    return `This action updates a #${id} createAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} createAccount`;
  }

  async checkCoupon(token: string) {
    // Me aseguro de que el token no llegue vacío o nulo.
    if (!token) {
      throw new BadRequestException('Token no puede estar vacío');
    }

    // Cambié findOneBy por queryBuilder para ser 100% explícito.
    // Esto fuerza la consulta a "WHERE createAccount.token = :token"
    const user = await this.createAccountRepository
      .createQueryBuilder('createAccount')
      .where('createAccount.token = :token', { token })
      .getOne();

    if (!user) {
      throw new NotFoundException('Token no valido');
    }
    
    user.token = ''; // Lo limpio para que no se use de nuevo
    user.confirmado = true;
    await this.createAccountRepository.save(user);
    return {
      message: 'Token confirmado correctamente',
      id: user.id,
      ok: true,
    };
  }
  async completeName(id: number, completeNameAccountDto: CompleteNameDto) {
    const user = await this.createAccountRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Chequeo de seguridad
    if (!user.confirmado) {
      throw new UnauthorizedException('La cuenta no ha sido verificada');
    }

    user.nombre = completeNameAccountDto.nombre;
    user.apellido = completeNameAccountDto.apellido;
    await this.createAccountRepository.save(user);
    return {
      message: 'Nombre y apellido completado correctamente',
      id: user.id,
      ok: true,
    };
  }
  async completePassword(
    id: number,
    completePasswordAccountDto: CompletePasswordDto,
  ) {
    const user = await this.createAccountRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Chequeo de seguridad
    if (!user.confirmado) {
      throw new UnauthorizedException('La cuenta no ha sido verificada');
    }

    user.password = completePasswordAccountDto.password;
    await this.createAccountRepository.save(user);
    return {
      message: 'Registro completado correctamente',
      id: user.id,
      ok: true,
    };
  }
}