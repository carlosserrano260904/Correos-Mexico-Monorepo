import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { CreateAccountModule } from './create-account/create-account.module';
import { RoutesModule } from './routes/routes.module';
import { ProfileModule } from './profile/profile.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import { PostalService } from './postal/postal.service';
import { GuiasTrazabilidadModule } from './guias_trazabilidad/infrastructure/guias_trazabilidad.module';
import { PostalController } from './postal/postal.controller';
import { UserModule } from './usuarios/user.module';
import { LikesModule } from './likes/likes.module';
import { AsignacionPaquetesModule } from './asignacion_paquetes/asignacion_paquetes.module'
import { TransportesModule } from './transportes/transportes.module';

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
    CreateAccountModule,
    RoutesModule,
    ProfileModule,
    ProductsModule,
    TransactionsModule,
    UploadImageModule,
    GuiasTrazabilidadModule,
    UserModule,
    LikesModule,
    AsignacionPaquetesModule,
    TransportesModule

  ],
  controllers: [AppController, PostalController],
  providers: [AppService, PostalService],
})
export class AppModule {}
