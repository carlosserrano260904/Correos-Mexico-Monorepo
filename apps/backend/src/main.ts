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

    // Configuración del CORS
    app.use(
      cors({
        origin: ['http://localhost:4200', 'https://midominio.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    )
    
    await app.listen(3000);
  } catch (err) {
    console.error('❌ Nest failed to start:', err);
  }
}
bootstrap();