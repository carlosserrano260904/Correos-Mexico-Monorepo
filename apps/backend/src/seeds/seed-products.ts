// src/seeds/seed-products.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { Category } from '../categories/entities/category.entity';

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

// Categorías (excluye la #9)
const categoryNames = [
  'Ropa, moda y calzado',
  'Joyería y bisutería',
  'Juegos y juguetes',
  'Hogar y decoración',
  'Belleza y cuidado personal',
  'Artesanías mexicanas',
  'FONART',
  'Original',
  // 'Jóvenes construyendo el futuro', // excluida
  'Hecho en Tamaulipas',
  'SEDECO Michoacán',
  'Filatelia mexicana',
  'Sabores artesanales',
];

function sampleProductsFor(category: string) {
  return [
    {
      nombre: `${category} - Producto A`,
      descripcion: `Producto A de la categoría ${category}`,
      precio: +(Math.random() * 900 + 100).toFixed(2),
      categoria: category, // <- string
    },
    {
      nombre: `${category} - Producto B`,
      descripcion: `Producto B de la categoría ${category}`,
      precio: +(Math.random() * 900 + 100).toFixed(2),
      categoria: category, // <- string
    },
  ];
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const ds = app.get(DataSource);

  const categoryRepo = ds.getRepository(Category);
  const productRepo = ds.getRepository(Product);
  const imageRepo = ds.getRepository(ProductImage);

  // 1) Upsert categorías por name
  for (const name of categoryNames) {
    const exists = await categoryRepo.findOne({ where: { name } });
    if (!exists) await categoryRepo.save(categoryRepo.create({ name }));
  }

  // 2) Crear productos con campo categoria:string + imagen por defecto
  for (const catName of categoryNames) {
    const samples = sampleProductsFor(catName);
    for (const p of samples) {
      const dup = await productRepo.findOne({ where: { nombre: p.nombre } });
      if (dup) continue;

      const product = await productRepo.save(productRepo.create(p));

      await imageRepo.save(
        imageRepo.create({
          url: DEFAULT_IMAGE,
          orden: 0,
          productId: product.id,
        }),
      );
    }
  }

  console.log('✅ Seed (categorías sin FK + productos) listo.');
  await app.close();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
