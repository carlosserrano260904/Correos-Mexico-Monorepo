import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(CreateAccount)
    private readonly repo: Repository<CreateAccount>,
  ) { }

  create(data: Partial<CreateAccount> & { profile?: Profile }) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findByCorreo(correo: string) {
    return this.repo.findOne({ where: { correo }, relations: ['profile'] });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['profile'] });
  }

  update(email: string, password: string) {
    return this.repo.update({ correo: email }, { password }); 
  }

  updateOTP(email: string, token: string) {
    return this.repo.update({ correo: email }, { token });
  }

  updateConfirmado(email: string, confirmado: boolean) {
    return this.repo.update({ correo: email }, { confirmado });
  }
}