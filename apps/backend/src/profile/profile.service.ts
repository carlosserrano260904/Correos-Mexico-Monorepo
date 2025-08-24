import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    await this.profileRepository.save(createProfileDto);
    return { message: 'Perfil creado correctamente' };
  }

  async findAll() {
    return this.profileRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const perfil = await this.profileRepository.findOne({ where: { id } });

    if (!perfil) {
      throw new NotFoundException('El perfil no existe');
    }

    const DEFAULT_IMAGE = `${process.env.BASE_URL}/uploads/defaults/avatar-default.png`;

    if (!perfil.imagen || perfil.imagen.trim() === '') {
      perfil.imagen = DEFAULT_IMAGE;
    }

    return perfil;
  }

  async update(id: number, dto: UpdateProfileDto) {
    const perfil = await this.findOne(id);
    Object.assign(perfil, dto);
    const perfilActualizado = await this.profileRepository.save(perfil);
    return perfilActualizado;
  }

  async remove(id: number) {
    const perfil = await this.findOne(id);
    await this.profileRepository.remove(perfil);
    return { message: 'Perfil eliminado correctamente' };
  }

  async save(profile: Profile): Promise<Profile> {
    return this.profileRepository.save(profile);
  }

  async updateAvatar(id: number, url: string): Promise<Profile> {
    const perfil = await this.findOne(id);
    perfil.imagen = url;
    return this.profileRepository.save(perfil);
  }
}