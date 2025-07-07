import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findByCorreo(correo: string) {
    return this.repo.findOne({ where: { correo } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(email: string, password: string) {
    return this.repo.update({ correo: email }, { contrasena: password }); 
  }
}