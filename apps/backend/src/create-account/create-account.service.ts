import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreateAccountDto } from './dto/create-create-account.dto';
import { UpdateCreateAccountDto } from './dto/update-create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccount } from './entities/create-account.entity';
import { Repository } from 'typeorm';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';
import { generateToken } from '../utils/token';
import { CompleteNameDto } from './dto/comple-name.dto';
import { CompletePasswordDto } from './dto/complete-password.dto';

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
    const user = await this.createAccountRepository.findOneBy({ token });
    if (!user) {
      throw new NotFoundException('Token no valido');
    }
    user.token = '';
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
    user.password = completePasswordAccountDto.password;
    await this.createAccountRepository.save(user);
    return {
      message: 'Registro completado correctamente',
      id: user.id,
      ok: true,
    };
  }
}
