import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cors from 'cors';

let cachedServer: any;
const IS_VERCEL = process.env.VERCEL === '1';

async function setupNestApp(expressApp: express.Express): Promise<any> {
  // Use ExpressAdapter to inject the external Express instance
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.setGlobalPrefix('api');
  if (!IS_VERCEL) {
    // ONLY set up Swagger in local/dev environment
    const configDocs = new DocumentBuilder()
      .setTitle('Correos de Mexico')
      .setDescription('Documentacion sobre las APIS del proyecto')
      .setVersion('1.0')
      .addTag('Usuarios')
      .build();

    const document = SwaggerModule.createDocument(app, configDocs);
    SwaggerModule.setup('docs', app, document);
    console.log('[Swagger] Documentation available at /docs');
  }

  app.use(
    cors({
      origin: [
        'http://localhost:4200',
        'https://midominio.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Initialize the application without starting the listener
  await app.init();
  return expressApp;
}

// Vercel invokes this exported function on every request.
export default async (req: any, res: any) => {
  if (!cachedServer) {
    const expressApp = express();
    cachedServer = await setupNestApp(expressApp);
    // Use the NestJS internal logger if available, otherwise console.log
    console.log('[Nest] Vercel Serverless function initialized (Cold Start)');
  }
  // Execute the cached Express handler
  cachedServer(req, res);
};

// This runs when VERCEL environment variable is NOT set (e.g., when running 'npm start' or 'npm run dev')
async function localBootstrap() {
  const expressApp = express();
  const server = await setupNestApp(expressApp);

  const port = process.env.PORT || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`[Nest] Servidor prendido en el puerto: ${port}`);
  });
}

// Only run the traditional listener if we are not in the Vercel environment
if (!IS_VERCEL) {
  localBootstrap().catch((err) => {
    console.error('❌ Nest failed to start:', err);
  });
}
