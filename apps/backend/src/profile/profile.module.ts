import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile } from './entities/profile.entity';
import { UploadImageModule } from '../upload-image/upload-image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UploadImageModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}