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
  // Ajusta la ruta según tu proyecto
import { Separator } from '../../../../../components/ui/separator';
import { uploadApiService } from '@/services/uploadapi';

interface Data {
  entradas: ProductosProps[];
  variants?: 'full' | 'compact';
}

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

export default function TableDemo({ entradas, variants = 'full' }: Data) {
  // Guardamos las entradas con la URL resuelta
  const [lista, setLista] = useState<ProductosProps[]>([]);

  useEffect(() => {
    let cancelled = false;

    const procesarEntradas = async () => {
      const procesadas = await Promise.all(
        entradas.map(async (entrada) => {
          const { ProductImageUrl } = entrada;
          // Si no hay imagen, usa la imagen por defecto
          if (!ProductImageUrl) {
            return { ...entrada, ProductImageUrl: DEFAULT_IMAGE };
          }
          // Si ya es una URL completa, úsala tal cual
          const isFullUrl = /^https?:\/\//i.test(ProductImageUrl);
          if (isFullUrl) {
            return { ...entrada };
          }
          // De lo contrario, resuelve el key a una URL firmada
          try {
            const url = await uploadApiService.getImageUrl(ProductImageUrl);
            return { ...entrada, ProductImageUrl: url };
          } catch {
            return { ...entrada, ProductImageUrl: DEFAULT_IMAGE };
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
                <TableHead>Producto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventario</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Vendedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((entrada) => (
                <Producto
                  key={entrada.ProductID}
                  {...entrada}             // se pasan todas las propiedades de ProductosProps
                  variant={variants}       // y se sobrescribe/añade 'variant'
                />
              ))}
            </TableBody>

          </Table>
        </div>
      );

    case 'compact':
      return (
        <div className="bg-white max-h-[270px] overflow-y-auto rounded-xl border">
          {lista.map((entrada, idx) => (
          <div className="px-6" key={idx}>
            <Producto
              key={entrada.ProductID}
              {...entrada}
              variant={variants}
            />
            {idx < lista.length - 1 && <Separator />}
          </div>
        ))}
        </div>
      );
  }
}
