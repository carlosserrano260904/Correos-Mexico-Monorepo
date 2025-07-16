import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
//import { UploadImageModule } from 'src/upload-image/upload-image.module'; temporalmente comentado

@Module({
  imports:[TypeOrmModule.forFeature([Profile]),/*UploadImageModule*/],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
