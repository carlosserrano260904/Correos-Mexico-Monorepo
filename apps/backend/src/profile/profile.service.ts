import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly uploadImageService: UploadImageService,
  ) { }

  create(createProfileDto: CreateProfileDto) {
    this.profileRepository.save(createProfileDto);
    return 'Perfil creado correctamente';
  }

  findAll() {
    return this.profileRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number, includeSigned = false) {
    const perfil = await this.profileRepository.findOne({ where: { id } });

    if (!perfil) {
      throw new NotFoundException('El perfil no existe');
    }

    const DEFAULT_IMAGE = `${process.env.BASE_URL}/uploads/defaults/avatar-default.png`;

    if (!perfil.imagen || perfil.imagen.trim() === '') {
      perfil.imagen = DEFAULT_IMAGE;
      return perfil;
    }

    const isPublicUrl = perfil.imagen.startsWith('http') &&
      (perfil.imagen.includes('cloudinary.com') || perfil.imagen.includes('res.cloudinary.com'));

    if (includeSigned && !isPublicUrl && !perfil.imagen.includes('avatar-default.png')) {
      try {
        const signedUrl = await this.uploadImageService.getSignedUrlForImage(perfil.imagen);
        perfil.imagen = signedUrl;
      } catch (err) {
        console.error('Error al generar URL firmada:', err);
        perfil.imagen = DEFAULT_IMAGE;
      }
    }

    return perfil;
  }


  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const perfil = await this.findOne(id);

    perfil.nombre = updateProfileDto.nombre!;
    perfil.apellido = updateProfileDto.apellido!;
    perfil.numero = updateProfileDto.numero!;
    perfil.estado = updateProfileDto.estado!;
    perfil.ciudad = updateProfileDto.ciudad!;
    perfil.fraccionamiento = updateProfileDto.fraccionamiento!;
    perfil.calle = updateProfileDto.calle!;
    perfil.codigoPostal = updateProfileDto.codigoPostal!;

    await this.profileRepository.save(perfil);

    return { ok: true, message: 'Perfil actualizado correctamente' };
  }

  async remove(id: number) {
    const perfil = await this.findOne(id);
    await this.profileRepository.remove(perfil);
    return 'Perfil eliminado correctamente';
  }

  async save(profile: Profile): Promise<Profile> {
    return this.profileRepository.save(profile);
  }

  async updateAvatar(id: number, key: string): Promise<Profile> {
    const perfil = await this.findOne(id);
    perfil.imagen = key;
    return this.profileRepository.save(perfil);
  }
}