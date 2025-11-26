import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
// ZONA DE CONFLICTO EN IMPORTS RESUELTA
import { User } from './entities/user.entity';
import { CreateAccount } from '../create-account/entities/create-account.entity'; // Usamos rutas relativas (..)
import { Profile } from '../profile/entities/profile.entity'; // Usamos rutas relativas (..)

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(CreateAccount)
    private readonly repo: Repository<CreateAccount>,
  ) {}

  // --- MÉTODOS TUYOS (Eliminar Cuenta) ---
  async findByProfileId(
    profileIdToFind: number,
  ): Promise<CreateAccount | null> {
    return this.repo.findOne({
      where: { profile: { id: profileIdToFind } },
      relations: ['profile'],
    });
  }

  async deactivateUser(userId: number): Promise<any> {
    return this.repo.update(
      { id: userId }, // Busca por ID principal
      { isActive: false }, // Actualiza la columna
    );
  }
  // ---------------------------------------

  // --- MÉTODOS ORIGINALES ---

  async create(data: Partial<CreateAccount> & { profile?: Profile }) {
    const user = this.repo.create({
      ...data,
      tokenCreatedAt: new Date(),
    });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findByCorreo(correo: string) {
    return this.repo.findOne({
      where: { correo },
      relations: ['profile'],
    });
  }

  findByCorreoNoOAuth(correo: string) {
    return this.repo.findOne({
      where: {
        correo,
        password: Not('N/A: OAuth'),
      },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async update(email: string, password: string) {
    const result = await this.repo.update(
      {
        correo: email,
        password: Not('N/A: OAuth'),
      },
      { password, confirmado: true },
    );
    if (result.affected === 0) {
      this.logger.warn(`No se encontró usuario para actualizar: ${email}`);
    }
    return result;
  }

  async updateOTP(
    email: string,
    data: {
      token?: string | null;
      tokenCreatedAt?: Date | null;
      confirmado?: boolean;
    },
  ) {
    try {
      const result = await this.repo.update(
        {
          correo: email,
          password: Not('N/A: OAuth'),
        },
        {
          token: data.token,
          tokenCreatedAt: data.tokenCreatedAt,
          confirmado: data.confirmado,
        },
      );
      if (result.affected === 0) {
        this.logger.warn(`No se pudo actualizar OTP para: ${email}`);
      }
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar OTP: ${(error as Error).message}`);
      throw error;
    }
  }

  async updateConfirmado(email: string, confirmado: boolean) {
    const result = await this.repo.update(
      {
        correo: email,
        password: Not('N/A: OAuth'),
      },
      { confirmado },
    );
    if (result.affected === 0) {
      this.logger.warn(
        `No se pudo actualizar estado de confirmación para: ${email}`,
      );
    }
    return result;
  }

  // --- MÉTODOS DE DEVELOP (Cron Jobs) ---

  // CORRECCIÓN: Devuelve Promise<number> para usarlo en logs, o void.
  async cleanExpiredTokens(): Promise<number> {
    try {
      const expirationTime = new Date(Date.now() + (360 - 10) * 60 * 1000); // Ajuste según lógica de negocio
      const result = await this.repo
        .createQueryBuilder()
        .update(CreateAccount)
        .set({
          token: null,
          tokenCreatedAt: null,
        })
        .where('token_created_at < :expirationTime', { expirationTime })
        .andWhere('token IS NOT NULL')
        .execute();

      const cleanedCount = result.affected || 0;
      this.logger.log(`Tokens expirados limpiados: ${cleanedCount}`);
      return cleanedCount;
    } catch (error) {
      this.logger.error(
        `Error limpiando tokens expirados: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  // CORRECCIÓN: Devuelve Promise<number>
  async cleanUnverifiedUsers(): Promise<number> {
    try {
      const expirationTime = new Date(Date.now() - 18 * 60 * 60 * 1000);

      const result = await this.repo
        .createQueryBuilder()
        .delete()
        .from(CreateAccount)
        .where('confirmado = false')
        .andWhere('token_created_at < :expirationTime', { expirationTime })
        .andWhere('token_created_at IS NOT NULL')
        .execute();

      const deletedCount = result.affected || 0;
      this.logger.log(`Usuarios no verificados eliminados: ${deletedCount}`);
      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Error limpiando usuarios no verificados: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  async findUnverifiedUsers(expirationTime: Date) {
    return this.repo.find({
      where: {
        confirmado: false,
        tokenCreatedAt: LessThan(expirationTime),
      },
    });
  }
}
