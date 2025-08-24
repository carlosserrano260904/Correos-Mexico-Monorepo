import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const configDocs = new DocumentBuilder()
      .setTitle('Correos de Mexico')
      .setDescription('Documentacion sobre las APIS del proyecto')
      .setVersion('1.0')
      .addTag('Usuarios')
      .build();

    const document = SwaggerModule.createDocument(app, configDocs);
    SwaggerModule.setup('docs', app, document);

    // Configuración del CORS - Updated for file uploads
    app.use(
      cors({
        origin: [
          'http://localhost:4200', 
          'http://localhost:3000', 
          'http://localhost:3001', 
          'http://localhost:3002',
          'http://localhost:3003',  // Add more ports for dev
          'https://midominio.com'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
        allowedHeaders: [
          'Content-Type', 
          'Authorization', 
          'X-Requested-With',
          'Accept',
          'Origin',
          'Access-Control-Request-Method',
          'Access-Control-Request-Headers'
        ],
        credentials: true,
        optionsSuccessStatus: 200, // For legacy browser support
        maxAge: 86400 // Cache preflight for 24 hours
      }),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    )
    
    //await app.listen(3000);
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
    console.log('Servidor prendido en el puerto: ', process.env.PORT || 3000);
  } catch (err) {
    console.error('❌ Nest failed to start:', err);
  }
}
bootstrap();