import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(CreateAccount)
    private readonly repo: Repository<CreateAccount>,
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
    return this.repo.update({ correo: email }, { password }); 
  }
}