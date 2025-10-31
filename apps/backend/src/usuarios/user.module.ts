import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios, CreateAccount])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}