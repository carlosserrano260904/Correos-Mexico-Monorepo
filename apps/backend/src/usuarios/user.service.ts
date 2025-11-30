import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccount } from '../create-account/entities/create-account.entity';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(CreateAccount)
    private readonly repo: Repository<CreateAccount>,
  ) { }

  async create(data: Partial<CreateAccount> & { profile?: Profile }) {
    const user = this.repo.create({
      ...data,
      tokenCreatedAt: new Date() // Establecer fecha de creación del token
    });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findByCorreo(correo: string) {
    return this.repo.findOne({
      where: { correo },
      relations: ['profile']
    });
  }

  findByCorreoNoOAuth(correo: string) {
    return this.repo.findOne({
      where: {
        correo,
        password: Not("N/A: OAuth")
      }
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['profile']
    });
  }

  async update(email: string, password: string) {
    const result = await this.repo.update(
      {
        correo: email,
        password: Not("N/A: OAuth")
      },
      { password, confirmado: true }
    );

    if (result.affected === 0) {
      this.logger.warn(`No se encontró usuario para actualizar: ${email}`);
    }
    return result;
  }

  async updateOTP(email: string, data: {
    token?: string | null;
    tokenCreatedAt?: Date | null;
    confirmado?: boolean
  }) {
    try {
      const result = await this.repo.update(
        {
          correo: email,
          password: Not("N/A: OAuth")
        },
        {
          token: data.token,
          tokenCreatedAt: data.tokenCreatedAt, 
          confirmado: data.confirmado
        }
      );

      if (result.affected === 0) {
        this.logger.warn(`No se pudo actualizar OTP para: ${email}`);
      }
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar OTP: ${error.message}`);
      throw error;
    }
  }

  async updateConfirmado(email: string, confirmado: boolean) {
    const result = await this.repo.update(
      {
        correo: email,
        password: Not("N/A: OAuth")
      },
      { confirmado }
    );

    if (result.affected === 0) {
      this.logger.warn(`No se pudo actualizar estado de confirmación para: ${email}`);
    }
    return result;
  }

  async cleanExpiredTokens(): Promise<number> {
    try {
      const expirationTime = new Date(Date.now() + (360- 10) * 60 * 1000); // 10 minutos atrás (compensación de UTC -6)
      const result = await this.repo.createQueryBuilder()
        .update(CreateAccount)
        .set({
          token: null,
          tokenCreatedAt: null
        })
        .where("token_created_at < :expirationTime", { expirationTime })
        .andWhere("token IS NOT NULL")
        .execute();

      const cleanedCount = result.affected || 0;
      this.logger.log(`Tokens expirados limpiados: ${cleanedCount}`);
      return cleanedCount;
    } catch (error) {
      this.logger.error(`Error limpiando tokens expirados: ${error.message}`);
      throw error;
    }
  }

  async cleanUnverifiedUsers(): Promise<number> {
    try {
      const expirationTime = new Date(Date.now() - 18 * 60 * 60 * 1000); // 24 horas (compensación de UTC -6)

      const result = await this.repo.createQueryBuilder()
        .delete()
        .where("confirmado = false")
        .andWhere("token_created_at < :expirationTime", { expirationTime })
        .andWhere("token_created_at IS NOT NULL")
        .execute();

      const deletedCount = result.affected || 0;
      this.logger.log(`Usuarios no verificados eliminados: ${deletedCount}`);
      return deletedCount;
    } catch (error) {
      this.logger.error(`Error limpiando usuarios no verificados: ${error.message}`);
      throw error;
    }
  }

  async findUnverifiedUsers(expirationTime: Date) {
    return this.repo.find({
      where: {
        confirmado: false,
        tokenCreatedAt: LessThan(expirationTime)
      }
    });
  }

}