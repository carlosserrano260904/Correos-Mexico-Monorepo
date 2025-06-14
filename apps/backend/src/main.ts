import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule,DocumentBuilder} from '@nestjs/swagger'

async function bootstrap() {
  try{
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    const configDocs = new DocumentBuilder()
      .setTitle('Correos de Mexico')
      .setDescription('Documentacion sobre las APIS del proyecto')
      .setVersion('1.0')
      .addTag('Usuarios')
      .build()

    const document = SwaggerModule.createDocument(app,configDocs)

    SwaggerModule.setup('docs',app,document)
    await app.listen(3000);
    console.log(`🚀 Server is running on http://localhost:3000`);
  } catch (err) {
    console.error('❌ Nest failed to start:', err);
  }

  


  
}
bootstrap();
