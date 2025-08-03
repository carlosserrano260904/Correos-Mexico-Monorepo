import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UploadGcsModule } from 'src/cloud-storage/upload-gcs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UploadGcsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}