import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try{
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    await app.listen(3000);
    console.log(`🚀 Server is running on http://localhost:3000`);
  } catch (err) {
    console.error('❌ Nest failed to start:', err);
  }
  
}
bootstrap();
