// npx ts-node -r tsconfig-paths/register -P tsconfig.json src/seeds/seed-categories.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

// Ajusta la ruta si moviste el JSON
import * as categorias from './categorias.json';


async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const ds = app.get(DataSource);
  const categoryRepo = ds.getRepository(Category);

  // Si no quieres insertar "Jóvenes construyendo el futuro", filtra aquí:
  const data = (categorias as Array<{ name: string }>).filter(
    (c) => c.name.trim() !== 'Jóvenes construyendo el futuro'
  );

  for (const c of data) {
    const exists = await categoryRepo.findOne({ where: { name: c.name } });
    if (!exists) {
      await categoryRepo.save(categoryRepo.create({ name: c.name }));
    }
  }

  console.log('✅ Seed de categorías completado.');
  await app.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
