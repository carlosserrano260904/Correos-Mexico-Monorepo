import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';
import { CreateAccountService } from 'src/create-account/create-account.service';
import { EnviarCorreosService } from 'src/enviar-correos/enviar-correos.service';
import { LoginService } from './login.service';
import { CreateAccountModule } from 'src/create-account/create-account.module';

@Module({
  imports: [TypeOrmModule.forFeature([CreateAccount]), CreateAccountModule],
  controllers: [LoginController],
  providers: [LoginService, EnviarCorreosService, CreateAccountService],
})
export class LoginModule {}
