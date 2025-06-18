import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository:Repository<Profile>
  ){}
  create(createProfileDto: CreateProfileDto) {
    this.profileRepository.save(createProfileDto)
    return "Perfil creado correctamento";
  }

  findAll() {
    return this.profileRepository.find({
      order:{
        id:'DESC'
      }
    })
  }

  async findOne(id: number) {
    const perfil = await this.profileRepository.findOne({
      where:{
        id
      }
    })
    if(!perfil){
      throw new NotFoundException('El perfil no existe')
    }
    return perfil;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const perfil = await this.findOne(id)
    perfil.nombre = updateProfileDto.nombre!
    perfil.apellido = updateProfileDto.apellido!
    perfil.numero = updateProfileDto.numero!
    perfil.estado = updateProfileDto.estado!
    perfil.ciudad = updateProfileDto.ciudad!
    perfil.fraccionamiento = updateProfileDto.fraccionamiento!
    perfil.calle = updateProfileDto.calle!
    perfil.codigoPostal = updateProfileDto.codigoPostal!
    await this.profileRepository.save(perfil)
    return `Perfil actualizado correctamente`;
  }

  async remove(id: number) {
    const perfil = await this.findOne(id)
    await this.profileRepository.remove(perfil)
    return "Perfil eliminado correctamente";
  }
  async save(profile: Profile): Promise<Profile> {
    return this.profileRepository.save(profile);
  }
  async updateAvatar(id: number, imageUrl: string): Promise<Profile> {
    const perfil = await this.findOne(id);
    perfil.imagen = imageUrl;
    return this.profileRepository.save(perfil);
  }
}
