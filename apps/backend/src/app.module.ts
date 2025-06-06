import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { CreateAccountModule } from './create-account/create-account.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRootAsync({
      useFactory:typeOrmConfig,
      inject:[ConfigService]
    }),
    LoginModule,
    CreateAccountModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
