import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { ClerkController } from './clerk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccount } from '../create-account/entities/create-account.entity';
import { CreateAccountModule } from '../create-account/create-account.module';
import { EmailModule } from '../enviar-correos/enviar-correos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreateAccount]),
    CreateAccountModule,
    EmailModule,
  ],
  controllers: [ClerkController],
  providers: [ClerkService],
})
export class ClerkModule {}