import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacturasModule } from './facturas/facturas.module';
import { PagosModule } from './pagos/pagos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { AsignacionPaquetesModule } from './asignacion_paquetes/asignacion_paquetes.module'
import { CarritoModule } from './carrito/carrito.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { ConductoresModule } from './conductores/conductores.module';
import { OrdenModule } from './orden/orden.module';
import { UnidadesModule } from './unidades/unidades.module';
import { HistorialAsignacionesModule } from './historial-asignaciones/historial-asignaciones.module';
import { PaquetesModule } from './paquete/paquetes.module'
import { AuthModule } from './auth/auth.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { OficinasModule } from './oficinas/oficinas.module';
import { MisdireccionesModule } from './misdirecciones/misdirecciones.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ClerkModule } from './clerk/clerk.module';
import { ShippingRateModule } from './shipping_rates/shipping_rates.module';
import { Ubicaciones } from './ubicaciones/ubicaciones.module';
import { EnviosModule } from './envios/envios.module';
import { StripeModule } from './payments/stripe.module';
import { CardsModule } from './cards/cards.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { EmailModule } from './enviar-correos/enviar-correos.module';
import { ViewdocModule } from './viewdoc/viewdoc.module';
import { EjemploUsarGuiasModule } from './ejemploUsarGuias/ejemploUsarGuias.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewModule } from './review/review.module';
import {PDFGeneratorModule} from './guias_trazabilidad/infrastructure/pdf-generator/pdf-generator.module';
import { CouponModule } from './coupons/coupons.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal:true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory:typeOrmConfig,
      inject:[ConfigService]
    }),
    CreateAccountModule,
    RoutesModule,
    ProfileModule,  
    PagosModule,
    ProductsModule,
    TransactionsModule,
    FacturasModule,
    UploadImageModule,
    GuiasTrazabilidadModule,
    UserModule,
    AsignacionPaquetesModule,
    CarritoModule,
    FavoritosModule,
    ConductoresModule,
    UnidadesModule, 
    OrdenModule,  
    HistorialAsignacionesModule,
    PaquetesModule,
    AuthModule,
    ProveedoresModule,
    OficinasModule,
    MisdireccionesModule,
    PedidosModule,
    ClerkModule,
    ShippingRateModule,
    Ubicaciones,
    EnviosModule,
    StripeModule,
    CardsModule,
    VendedorModule,
    EmailModule,
    ViewdocModule,
    EjemploUsarGuiasModule,
    CategoriesModule,
    ReviewModule,
    PDFGeneratorModule,
    CouponModule,
  ],
  controllers: [AppController, PostalController],
  providers: [AppService, PostalService],
})
export class AppModule {}
