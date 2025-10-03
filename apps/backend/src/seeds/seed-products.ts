// src/seeds/seed-products.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource, Repository } from 'typeorm';
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

// Catálogos simples para valores variados
const MARCAS = ['Genérica', 'Artesanal MX', 'Premium Co', 'Hecho a Mano', 'Clásicos'];
const COLORES = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Madera', 'Dorado', 'Plateado'];
const VENDEDORES = ['Tienda Oficial', 'Market MX', 'Artesanos Unidos', 'Casa Central', 'Boutique Local'];

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrecio() {
  return +(Math.random() * 900 + 100).toFixed(2); // 100–1000
}

function randomInventario() {
  return Math.floor(Math.random() * 60) + 5; // 5–64
}

function randomVendidos(max = 150) {
  return Math.floor(Math.random() * max);
}

function randomSKU(base: string) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SKU-${base}-${suffix}`;
}

// Tipo de ayuda para construir productos sin relaciones ni id
type NewProduct = Omit<Product, 'id' | 'images' | 'favoritos' | 'carrito' | 'reviews'>;

// Genera 5 productos por categoría con todos los campos requeridos
function sampleProductsFor(category: string): NewProduct[] {
  const items: NewProduct[] = [];
  for (let i = 1; i <= 5; i++) {
    const marca = randomFrom(MARCAS);
    const color = randomFrom(COLORES);
    const nombre = `${category} - Producto ${i}`;
    const baseSlug = slugify(`${nombre} ${marca} ${color}`);
    const vendedor = randomFrom(VENDEDORES);

    items.push({
      nombre,
      descripcion: `Producto ${i} de la categoría ${category}. Elaboración de alta calidad.`,
      precio: randomPrecio(),
      categoria: category,

      inventario: randomInventario(),
      color,
      marca,
      slug: baseSlug,       // se ajusta si choca
      vendedor,
      estado: Math.random() < 0.9, // 90% activos
      vendidos: randomVendidos(),
      sku: '',              // se setea único abajo
      altura: null,
      largo: null,
      ancho: null,
      peso: null,
      idPerfil: null,
    });
  }
  return items;
}

async function ensureUniqueSlug(productRepo: Repository<Product>, base: string) {
  let slug = base;
  let n = 1;
  while (await productRepo.findOne({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

async function ensureUniqueSKU(productRepo: Repository<Product>, base: string) {
  let sku = randomSKU(base.toUpperCase());
  while (await productRepo.findOne({ where: { sku } })) {
    sku = randomSKU(base.toUpperCase());
  }
  return sku;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const ds: DataSource = app.get(DataSource);

  const categoryRepo = ds.getRepository(Category);
  const productRepo = ds.getRepository(Product);
  const imageRepo = ds.getRepository(ProductImage);

  // 1) Upsert categorías por name
  for (const name of categoryNames) {
    const exists = await categoryRepo.findOne({ where: { name } });
    if (!exists) await categoryRepo.save(categoryRepo.create({ name }));
  }

  // 2) Crear 5 productos por categoría con todos los campos + imagen por defecto
  for (const catName of categoryNames) {
    const samples = sampleProductsFor(catName);

    for (const p of samples) {
      // Idempotencia por nombre (ajusta si prefieres usar slug)
      const dupByName = await productRepo.findOne({ where: { nombre: p.nombre } });
      if (dupByName) continue;

      // Asegurar unicidad de slug y sku
      const base = slugify(`${p.nombre}-${p.marca}-${p.color}`);
      p.slug = await ensureUniqueSlug(productRepo, base);
      p.sku = await ensureUniqueSKU(
        productRepo,
        `${p.marca.substring(0, 3)}-${p.color.substring(0, 3)}`
      );

      // --- creación y guardado en dos pasos tipados (evita Product | Product[]) ---
      const entity: Product = productRepo.create(p as Partial<Product>) as Product;
      const saved: Product = await productRepo.save(entity);

      // Imagen por defecto
      const imgEntity = imageRepo.create({
        url: DEFAULT_IMAGE,
        orden: 0,
        productId: saved.id,
      });
      await imageRepo.save(imgEntity);
    }
  }

  console.log('✅ Seed completo: categorías y 5 productos por categoría con imagen por defecto.');
  await app.close();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
