import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

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

  const allowedOrigins = [
    'http://localhost:4200',
    'https://midominio.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.1.98:3000',
    'http://192.168.1.98:3001',
    'https://correos-mexico-monorepo-frontend-h6ur31uht.vercel.app',
    'https://correos-mexico-monorepo-git-8d0e31-emmanuels-projects-e8897a1f.vercel.app',
    'https://correos-mexico-monorepo-backend.vercel.app',
  ];

  // EN PRODUCCIÓN, PERMITE CUALQUIER SUBDOMINIO DE VERCEL
  if (IS_VERCEL) {
    allowedOrigins.push('https://*.vercel.app');
  }

  //  USAR enableCors() DE NESTJS EN LUGAR DE app.use(cors())
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como mobile apps o curl)
      if (!origin) return callback(null, true);
      
      // Verificar si el origin está en la lista permitida
      if (allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
          const regex = new RegExp(allowedOrigin.replace('*', '.*'));
          return regex.test(origin);
        }
        return allowedOrigin === origin;
      })) {
        return callback(null, true);
      } else {
        console.log('CORS Blocked:', origin);
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

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
    console.log('[Nest] Vercel Serverless function initialized (Cold Start)');
  }
  // Execute the cached Express handler
  cachedServer(req, res);
};

// This runs when VERCEL environment variable is NOT set
async function localBootstrap() {
  const expressApp = express();
  const server = await setupNestApp(expressApp);

  const port = process.env.PORT || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`[Nest] Servidor prendido en el puerto: ${port}`);
  });
}

if (!IS_VERCEL) {
  localBootstrap().catch((err) => {
    console.error('Nest failed to start:', err);
  });
}