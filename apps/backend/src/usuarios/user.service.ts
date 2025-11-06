// Archivo: apps/backend/src/usuarios/user.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Esta entidad no la usamos aquí
import { CreateAccount } from 'src/create-account/entities/create-account.entity';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(CreateAccount)
    private readonly repo: Repository<CreateAccount>,
  ) { }

  // --- 👇 MÉTODO NUEVO AÑADIDO (para deleteAccount) ---
  async findByProfileId(profileIdToFind: number): Promise<CreateAccount | null> {
    return this.repo.findOne({ 
        where: { profile: { id: profileIdToFind } }, 
        relations: ['profile'] 
    });
  }

  // --- 👇 MÉTODO NUEVO AÑADIDO (para deleteAccount) ---
  async deactivateUser(userId: number): Promise<any> {
    return this.repo.update(
      { id: userId },     // Busca por ID principal
      { isActive: false } // Actualiza la columna
    );
  }

  // --- (Resto de métodos originales) ---

  async create(data: Partial<CreateAccount> & { profile?: Profile }) {
    const user = this.repo.create({
      ...data,
      tokenCreatedAt: new Date()
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
      this.logger.error(`Error al actualizar OTP: ${(error as Error).message}`);
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

  // --- 👇 CORRECCIÓN: Cambiado a Promise<void> ---
  async cleanExpiredTokens(): Promise<void> { 
    try {
      const expirationTime = new Date(Date.now() + (360- 10) * 60 * 1000); 
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
    } catch (error) {
      this.logger.error(`Error limpiando tokens expirados: ${(error as Error).message}`);
      throw error;
    }
  }

  // --- 👇 CORRECCIÓN: Cambiado a Promise<void> ---
  async cleanUnverifiedUsers(): Promise<void> { 
    try {
      const expirationTime = new Date(Date.now() - 18 * 60 * 60 * 1000); 

      const result = await this.repo.createQueryBuilder()
        .delete()
        .from(CreateAccount)
        .where("confirmado = false")
        .andWhere("token_created_at < :expirationTime", { expirationTime })
        .andWhere("token_created_at IS NOT NULL")
        .execute();

      const deletedCount = result.affected || 0;
      this.logger.log(`Usuarios no verificados eliminados: ${deletedCount}`);
    } catch (error) {
      this.logger.error(`Error limpiando usuarios no verificados: ${(error as Error).message}`);
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