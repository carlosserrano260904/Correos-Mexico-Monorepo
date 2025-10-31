// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../usuarios/entities/user.entity';

@Injectable()
export class AdminService {
  
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuarioRepository: Repository<Usuarios>,
  ) {}

  async findAllUsers() { //Encontrar todos los usuarios
    return this.usuarioRepository.find();
  }

  async FindById(id: number) { //Encontrar usuario por ID
    const usuario = await this.usuarioRepository.findOneBy({id: id})

    if(!usuario){
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return usuario;
  }

  async updateUserRole(id: number, rol: string) { //Actualizar el rol de un usuario
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    usuario.rol = rol;
    return this.usuarioRepository.save(usuario);
  }

  async deleteUser(id: number) { //Eliminar un usuario
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return; // No se devuelve contenido
  }
}