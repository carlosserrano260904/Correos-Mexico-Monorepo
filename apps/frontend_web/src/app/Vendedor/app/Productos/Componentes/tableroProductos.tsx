'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../../components/ui/table';
import { ProductosProps } from '@/types/index';
import { Producto } from '../../../components/primitivos';
import { mapFrontendProductToComponent } from '@/utils/componentMappers';
import { FrontendProduct } from '@/schemas/products';
  // Ajusta la ruta según tu proyecto
import { Separator } from '../../../../../components/ui/separator';
import { uploadApiService } from '@/services/uploadapi';

interface Data {
  entradas: FrontendProduct[];
  variants?: 'full' | 'compact';
}

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

export default function TableDemo({ entradas, variants = 'full' }: Data) {
  // Guardamos las entradas con la URL resuelta
  const [lista, setLista] = useState<FrontendProduct[]>([]);

  useEffect(() => {
    let cancelled = false;

    const procesarEntradas = async () => {
      const procesadas = await Promise.all(
        entradas.map(async (entrada) => {
          const { ProductImageUrl } = entrada;
          // Si no hay imagen, usa la imagen por defecto
          if (!ProductImageUrl) {
            return { 
              ...entrada, 
              ProductImageUrl: DEFAULT_IMAGE,
              ProductImages: entrada.ProductImages || [],
              ProductCupons: entrada.ProductCupons || []
            };
          }
          // Si ya es una URL completa, úsala tal cual
          const isFullUrl = /^https?:\/\//i.test(ProductImageUrl);
          if (isFullUrl) {
            return { 
              ...entrada,
              ProductImages: entrada.ProductImages || [],
              ProductCupons: entrada.ProductCupons || []
            };
          }
          // De lo contrario, resuelve el key a una URL firmada
          try {
            const url = await uploadApiService.getImageUrl(ProductImageUrl);
            return { 
              ...entrada, 
              ProductImageUrl: url,
              ProductImages: entrada.ProductImages || [],
              ProductCupons: entrada.ProductCupons || []
            };
          } catch {
            return { 
              ...entrada, 
              ProductImageUrl: DEFAULT_IMAGE,
              ProductImages: entrada.ProductImages || [],
              ProductCupons: entrada.ProductCupons || []
            };
          }
        })
      );
      if (!cancelled) setLista(procesadas);
    };

    procesarEntradas();
    return () => {
      cancelled = true;
    };
  }, [entradas]);

  switch (variants) {
    case 'full':
      return (
        <div className="max-h-[620px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=''>Producto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventario</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((entrada) => {
                try {
                  // ✅ Usar el mapper para convertir FrontendProduct a ProductoComponent
                  const productoProps = mapFrontendProductToComponent(
                    entrada, 
                    variants as 'full' | 'compact'
                  );
                  return (
                    <Producto
                      key={entrada.ProductID}
                      {...productoProps}
                      ProductImages={productoProps.ProductImages || []}
                      ProductCupons={productoProps.ProductCupons || []}
                    />
                  );
                } catch (error) {
                  console.error('❌ Error mapeando producto:', error, entrada);
                  // Fallback: usar los datos directamente si el mapper falla
                  return (
                    <Producto
                      key={entrada.ProductID}
                      ProductID={entrada.ProductID}
                      ProductName={entrada.ProductName}
                      ProductDescription={entrada.ProductDescription || 'Sin descripción'}
                      ProductImageUrl={entrada.ProductImageUrl || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'}
                      productPrice={entrada.productPrice}
                      ProductBrand={entrada.ProductBrand || 'Sin marca'}
                      ProductStatus={entrada.ProductStatus}
                      ProductStock={entrada.ProductStock}
                      ProductCategory={entrada.ProductCategory || 'Sin categoría'}
                      ProductSellerName={entrada.ProductSellerName || 'Sin vendedor'}
                      ProductSold={entrada.ProductSold}
                      ProductSlug={entrada.ProductSlug}
                      Color={entrada.Color}
                      ProductSKU={entrada.ProductSKU}
                      ProductImages={entrada.ProductImages || []}
                      ProductCupons={entrada.ProductCupons || []}
                      variant={variants as 'full' | 'compact'}
                    />
                  );
                }
              })}
            </TableBody>

          </Table>
        </div>
      );

    case 'compact':
      return (
        <div className="bg-white max-h-[270px] overflow-y-auto rounded-xl border">
          {lista.map((entrada, idx) => {
            try {
              // ✅ Usar el mapper para convertir FrontendProduct a ProductoComponent
              const productoProps = mapFrontendProductToComponent(
                entrada, 
                variants as 'full' | 'compact'
              );
              return (
                <div className="px-6" key={idx}>
                  <Producto
                    key={entrada.ProductID}
                    {...productoProps}
                    ProductImages={productoProps.ProductImages || []}
                    ProductCupons={productoProps.ProductCupons || []}
                  />
                  {idx < lista.length - 1 && <Separator />}
                </div>
              );
            } catch (error) {
              console.error('❌ Error mapeando producto (compact):', error, entrada);
              // Fallback: usar los datos directamente si el mapper falla
              return (
                <div className="px-6" key={idx}>
                  <Producto
                    key={entrada.ProductID}
                    ProductID={entrada.ProductID}
                    ProductName={entrada.ProductName}
                    ProductDescription={entrada.ProductDescription || 'Sin descripción'}
                    ProductImageUrl={entrada.ProductImageUrl || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'}
                    productPrice={entrada.productPrice}
                    ProductBrand={entrada.ProductBrand || 'Sin marca'}
                    ProductStatus={entrada.ProductStatus}
                    ProductStock={entrada.ProductStock}
                    ProductCategory={entrada.ProductCategory || 'Sin categoría'}
                    ProductSellerName={entrada.ProductSellerName || 'Sin vendedor'}
                    ProductSold={entrada.ProductSold}
                    ProductSlug={entrada.ProductSlug}
                    Color={entrada.Color}
                    ProductSKU={entrada.ProductSKU}
                    ProductImages={entrada.ProductImages || []}
                    ProductCupons={entrada.ProductCupons || []}
                    variant={variants as 'full' | 'compact'}
                  />
                  {idx < lista.length - 1 && <Separator />}
                </div>
              );
            }
          })}
        </div>
      );
  }
}
