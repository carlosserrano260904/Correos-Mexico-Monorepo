import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductoImageDto {
  @ApiProperty({
    example: 3,
    description: 'ID de la imagen del producto',
  })
  id: number;

  @ApiProperty({
    example: 'https://res.cloudinary.com/.../default.jpg',
    description: 'URL de la imagen del producto',
  })
  url: string;

  @ApiProperty({
    example: 0,
    description: 'Orden en que se mostrará la imagen',
  })
  orden: number;

  @ApiProperty({
    example: 3,
    description: 'ID del producto al que pertenece la imagen',
  })
  productId: number;
}

export class ProductoDto {
  @ApiProperty({ example: 3, description: 'ID único del producto' })
  id: number;

  @ApiProperty({ example: 'Ropa, moda y calzado - Producto 3', description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ example: 'Producto de alta calidad', description: 'Descripción del producto' })
  descripcion: string;

  @ApiPropertyOptional({ example: null, description: 'Altura del producto (si aplica)' })
  altura?: number;

  @ApiPropertyOptional({ example: null, description: 'Largo del producto (si aplica)' })
  largo?: number;

  @ApiPropertyOptional({ example: null, description: 'Ancho del producto (si aplica)' })
  ancho?: number;

  @ApiPropertyOptional({ example: null, description: 'Peso del producto (si aplica)' })
  peso?: number;

  @ApiProperty({ example: 830.81, description: 'Precio del producto' })
  precio: number;

  @ApiProperty({ example: 'Ropa, moda y calzado', description: 'Categoría del producto' })
  categoria: string;

  @ApiProperty({ example: 21, description: 'Cantidad disponible en inventario' })
  inventario: number;

  @ApiProperty({ example: 'Azul', description: 'Color del producto' })
  color: string;

  @ApiProperty({ example: 'Artesanal MX', description: 'Marca del producto' })
  marca: string;

  @ApiProperty({ example: 'ropa-moda-y-calzado-producto-3-artesanal-mx-azul', description: 'Slug único del producto' })
  slug: string;

  @ApiProperty({ example: 'Boutique Local', description: 'Nombre del vendedor' })
  vendedor: string;

  @ApiProperty({ example: true, description: 'Estado del producto (activo/inactivo)' })
  estado: boolean;

  @ApiProperty({ example: 65, description: 'Número de unidades vendidas' })
  vendidos: number;

  @ApiProperty({ example: 'SKU-ART-AZU-FT4T', description: 'Código SKU del producto' })
  sku: string;

  @ApiPropertyOptional({ example: null, description: 'ID del perfil del vendedor (si aplica)' })
  idPerfil?: number;

  @ApiProperty({ type: [ProductoImageDto], description: 'Imágenes asociadas al producto' })
  images: ProductoImageDto[];
}

export class PedidoProductoResponseDto {
  @ApiProperty({ example: 2, description: 'ID del registro en la tabla pedido-producto' })
  id: number;

  @ApiProperty({ example: 1, description: 'Cantidad solicitada del producto' })
  cantidad: number;

  @ApiProperty({ type: ProductoDto, description: 'Detalle del producto dentro del pedido' })
  producto: ProductoDto;

  @ApiProperty({ example: 3, description: 'ID del producto relacionado' })
  productoId: number;

  @ApiProperty({ example: 2, description: 'ID del pedido al que pertenece' })
  pedidoId: number;

  @ApiPropertyOptional({ example: null, description: 'Número de guía del envío (si existe)' })
  n_guia?: string;
}

export class DireccionDto {
  @ApiProperty({ example: 7, description: 'ID de la dirección registrada' })
  id: number;

  @ApiProperty({ example: 'Daniel', description: 'Nombre del destinatario' })
  nombre: string;

  @ApiProperty({ example: 'Unipoli', description: 'Calle de la dirección' })
  calle: string;

  @ApiProperty({ example: 'Victoria de Durango Centro', description: 'Colonia o fraccionamiento' })
  colonia_fraccionamiento: string;

  @ApiPropertyOptional({ example: null, description: 'Número interior (si aplica)' })
  numero_interior?: string;

  @ApiProperty({ example: 500, description: 'Número exterior' })
  numero_exterior: number;

  @ApiProperty({ example: '6182438977', description: 'Número de celular del contacto' })
  numero_celular: string;

  @ApiProperty({ example: '34000', description: 'Código postal' })
  codigo_postal: string;

  @ApiProperty({ example: 'Durango', description: 'Estado de la dirección' })
  estado: string;

  @ApiProperty({ example: 'Durango', description: 'Municipio de la dirección' })
  municipio: string;

  @ApiProperty({ example: 'Casa blanca', description: 'Información adicional de la dirección' })
  mas_info: string;
}

export class PedidoResponseDto {
  @ApiProperty({ example: 2, description: 'ID único del pedido' })
  id: number;

  @ApiProperty({ example: '2655', description: 'Monto total del pedido' })
  total: string;

  @ApiProperty({ example: 'aprobado', description: 'Estado actual del pedido' })
  status: string;

  @ApiProperty({ example: '2025-07-23T10:25:43.049Z', description: 'Fecha en la que se generó el pedido' })
  fecha: string;

  @ApiProperty({ example: 31, description: 'ID del perfil (usuario) que hizo el pedido' })
  profileId: number;

  @ApiProperty({ type: [PedidoProductoResponseDto], description: 'Lista de productos incluidos en el pedido' })
  productos: PedidoProductoResponseDto[];

  @ApiProperty({ type: DireccionDto, description: 'Dirección de entrega asociada al pedido' })
  direccion: DireccionDto;

  @ApiProperty({ example: 7, description: 'ID de la dirección asociada' })
  direccionId: number;

  @ApiPropertyOptional({ example: null, description: 'Estado del pago (si aplica)' })
  estatus_pago?: string;

  @ApiPropertyOptional({ example: null, description: 'Calle (en caso de dirección alternativa)' })
  calle?: string;

  @ApiPropertyOptional({ example: null, description: 'Número interior (en dirección alternativa)' })
  numero_int?: string;

  @ApiPropertyOptional({ example: null, description: 'Número exterior (en dirección alternativa)' })
  numero_exterior?: string;

  @ApiPropertyOptional({ example: null, description: 'Código postal (en dirección alternativa)' })
  cp?: string;

  @ApiPropertyOptional({ example: null, description: 'Ciudad (en dirección alternativa)' })
  ciudad?: string;

  @ApiPropertyOptional({ example: null, description: 'Nombre del titular de la tarjeta (si aplica)' })
  nombre?: string;

  @ApiPropertyOptional({ example: null, description: 'Últimos 4 dígitos de la tarjeta (si aplica)' })
  last4?: string;

  @ApiPropertyOptional({ example: null, description: 'Marca de la tarjeta (Visa, MasterCard, etc.)' })
  brand?: string;
}
