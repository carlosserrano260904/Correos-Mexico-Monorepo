import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource, Repository } from 'typeorm';
import { Product, productStatus } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/productImage.entity';
// --- IMPORTACIONES NUEVAS ---
import { ProductCategory } from '../products/entities/productCategory.entity';
import { ProductVariant } from '../products/entities/productVariant.entity';
import { ProductAttributeValue } from '../products/entities/productAttributeValue.entity';
import { AttributeDefinition } from '../products/entities/attributeDefinition.entity';
import { Review } from 'src/review/entities/review.entity';
import { Favorito } from 'src/favoritos/entities/favorito.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';
const SELLER_ID_PRUEBA = 'f1g2h3i4-j5k6-7890-l1m2-n3o4p5q6r7s8'; // UUID de vendedor de prueba

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
  'Hecho en Tamaulipas',
  'SEDECO Michoacán',
  'Filatelia mexicana',
  'Sabores artesanales',
];

// Catálogos simples para valores variados
const MARCAS = ['Genérica', 'Artesanal MX', 'Premium Co', 'Hecho a Mano', 'Clásicos'];
const COLORES = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Madera', 'Dorado', 'Plateado'];
const VENDEDORES = ['Tienda Oficial', 'Market MX', 'Artesanos Unidos', 'Casa Central', 'Boutique Local'];

// --- FUNCIONES DE AYUDA (Sin cambios) ---
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
function randomSKU(base: string) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SKU-${base}-${suffix}`;
}
// --- FIN FUNCIONES DE AYUDA ---

// --- FUNCIONES DE UNICIDAD (Modificadas) ---
async function ensureUniqueSlug(productRepo: Repository<Product>, base: string) {
  let slug = base;
  let n = 1;
  while (await productRepo.findOne({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}
// AHORA REVISA EL REPO DE VARIANTES
async function ensureUniqueSKU(variantRepo: Repository<ProductVariant>, base: string) {
  let sku = randomSKU(base.toUpperCase());
  while (await variantRepo.findOne({ where: { sku } })) {
    sku = randomSKU(base.toUpperCase());
  }
  return sku;
}

/**
 * Función principal del Seeder
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const ds: DataSource = app.get(DataSource);

  // --- OBTENER TODOS LOS REPOSITORIOS ---
  const productRepo = ds.getRepository(Product);
  const categoryRepo = ds.getRepository(ProductCategory);
  const imageRepo = ds.getRepository(ProductImage);
  const variantRepo = ds.getRepository(ProductVariant);
  const attrDefRepo = ds.getRepository(AttributeDefinition);
  const attrValueRepo = ds.getRepository(ProductAttributeValue);
  
  // Repos para limpiar
  const reviewRepo = ds.getRepository(Review);
  const favoritoRepo = ds.getRepository(Favorito);
  const carritoRepo = ds.getRepository(Carrito);

  //LIMPIAR TABLAS (En orden inverso de dependencias)
  console.log('Limpiando base de datos.');
  await attrValueRepo.delete({});
  await imageRepo.delete({});
  await variantRepo.delete({});
  await reviewRepo.delete({});
  await favoritoRepo.delete({});
  await carritoRepo.delete({});
  await productRepo.delete({});
  await categoryRepo.delete({}); // Borrar esto borrará la tabla M:M
  await attrDefRepo.delete({});
  console.log('Base de datos limpia.');

  // INICIAR TRANSACCIÓN
  const queryRunner = ds.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('Creando pre-requisitos (Atributos y Categorías)...');
    
    //CREAR ATRIBUTOS (DENTRO DE LA TRANSACCIÓN)
    const attrColor = await queryRunner.manager.save(
      attrDefRepo.create({ name: 'Color', type: 'text', isVariantOption: true }),
    );
    const attrMarca = await queryRunner.manager.save(
      attrDefRepo.create({ name: 'Marca', type: 'text', isVariantOption: false }), // 'Marca' no define variantes
    );

    //CREAR CATEGORÍAS (DENTRO DE LA TRANSACCIÓN)
    const categoriesMap = new Map<string, ProductCategory>();
    for (const name of categoryNames) {
      const category = await queryRunner.manager.save(
        categoryRepo.create({
          name,
          slug: slugify(name),
          attributes: [attrColor, attrMarca], // Asignamos atributos a la categoría
        }),
      );
      categoriesMap.set(name, category);
    }
    console.log(`${categoryNames.length} categorías creadas.`);

    //CREAR PRODUCTOS (LÓGICA ANIDADA)
    console.log('Creando productos...');
    let productsCreated = 0;
    
    for (const catName of categoryNames) {
      const category = categoriesMap.get(catName);

      if (!category){
        console.warn(`Categoría "${catName}" no encontrada en el mapa.`);
        continue; //Saltar a la siguiente categoría.
      }
      
      for (let i = 1; i <= 5; i++) {
        //Generar datos aleatorios
        const marca = randomFrom(MARCAS);
        const color = randomFrom(COLORES);
        const title = `${catName} - Producto ${i}`;
        const baseSlug = slugify(`${title} ${marca} ${color}`);
        
        // Crear la entidad PRODUCT (Nivel Superior)
        const product = await queryRunner.manager.save(
          productRepo.create({
            title: title, // 'nombre' ahora es 'title'
            description: `Producto ${i} de la categoría ${catName}.`,
            slug: await ensureUniqueSlug(productRepo, baseSlug), // Revisa el repo real
            categoryId: category.id,
            sellerId: SELLER_ID_PRUEBA,
            status: Math.random() < 0.9 ? productStatus.PUBLISHED : productStatus.DRAFT,
          }),
        );
        
        // Crear la entidad PRODUCT_VARIANT (Nivel Medio)
        // Para este seeder, 1 producto = 1 variante
        const newSku = await ensureUniqueSKU(
          variantRepo,
          `${marca.slice(0,3)}-${color.slice(0,3)}`,
        );
        const variant = await queryRunner.manager.save(
          variantRepo.create({
            product: product, // ¡Conexión al producto!
            title: title, // La variante puede tener el mismo título
            price: randomPrecio(),
            inventoryQuantity: randomInventario(),
            sku: newSku,
            // 'peso', 'altura', etc. ahora están en la variante
            weight: null, 
          }),
        );
        
        //Crear la entidad PRODUCT_IMAGE
        await queryRunner.manager.save(
          imageRepo.create({
            url: DEFAULT_IMAGE,
            sortOrder: 0,
            variant: variant, // ¡Conexión a la VARIANTE!
          }),
        );

        //Crear PRODUCT_ATTRIBUTE_VALUE
        // Atributo 1: Color
        await queryRunner.manager.save(
          attrValueRepo.create({
            product: product,
            variant: variant,
            attributeId: attrColor.id,
            value: color,
          }),
        );
        // Atributo 2: Marca
        await queryRunner.manager.save(
          attrValueRepo.create({
            product: product,
            variant: variant,
            attributeId: attrMarca.id,
            value: marca,
          }),
        );
        productsCreated++;
      }
    }
    console.log(`${productsCreated} productos creados.`);

    //SI TODO SALIÓ BIEN, CONFIRMAR
    await queryRunner.commitTransaction();
    console.log('Seed completo: Transacción confirmada.');

  } catch (e) {
    //SI ALGO FALLÓ, REVERTIR
    console.error('Error durante el seeding, revirtiendo transacción...');
    console.error(e);
    await queryRunner.rollbackTransaction();
    
  } finally {
    //LIBERAR EL QUERYRUNNER
    await queryRunner.release();
    await app.close();
    console.log('Conexión cerrada.');
  }
}

bootstrap().catch((e) => {
  console.error('Error fatal al ejecutar bootstrap:', e);
  process.exit(1);
});