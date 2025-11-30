import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateAccountController } from './create-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccount } from './entities/create-account.entity';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';

@Module({
  imports: [TypeOrmModule.forFeature([CreateAccount])],
  controllers: [CreateAccountController],
  providers: [CreateAccountService, EnviarCorreosService, TypeOrmModule],
})
export class CreateAccountModule {}
