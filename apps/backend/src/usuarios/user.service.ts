import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(CreateAccount)
    private readonly repo: Repository<CreateAccount>,
  ) { }

  async create(data: Partial<CreateAccount> & { profile?: Profile }) {
    const user = this.repo.create(data);
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
      { password }
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
          tokenCreatedAt: data.tokenCreatedAt, // Cambiado a camelCase
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
      const expirationTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutos atrás

      const result = await this.repo.createQueryBuilder()
        .update(CreateAccount)
        .set({
          token: null,
          tokenCreatedAt: null // Cambiado a camelCase
        })
        .where("tokenCreatedAt < :expirationTime", { expirationTime })
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
}