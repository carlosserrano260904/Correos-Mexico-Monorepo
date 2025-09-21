export interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  inventario: number;
  precio: number;
  categoria: string;
  color: string;
}

export interface CreateProductDto {
  nombre: string;
  descripcion: string;
  inventario: number;
  precio: number;
  categoria: string;
  color: string;
}

export interface UpdateProductDto {
  nombre: string;
  descripcion: string;
  imagen: string;
  inventario: number;
  precio: number;
  categoria: string;
  color: string;
}

// Mapper: Backend Product → Frontend ProductosProps
export const mapBackendProductToFrontend = (backendProduct: BackendProduct): import('../types/interface').ProductosProps => {
  return {
    ProductID: backendProduct.id,
    ProductImageUrl: backendProduct.imagen,
    productPrice: backendProduct.precio,
    ProductName: backendProduct.nombre,
    ProductDescription: backendProduct.descripcion,
    ProductSlug: backendProduct.nombre.toLowerCase().replace(/\s+/g, '-'),
    ProductBrand: 'Marca por defecto', // No existe en backend
    ProductStatus: backendProduct.inventario > 0,
    ProductStock: backendProduct.inventario,
    ProductCategory: backendProduct.categoria,
    ProductSellerName: 'Vendedor por defecto', // No existe en backend
    ProductSold: 0, // No existe en backend
    variants: [
      {
        tipo: 'Color',
        price: backendProduct.precio,
        valor: backendProduct.color,
        inventario: backendProduct.inventario,
        sku: `SKU-${backendProduct.id}`
      }
    ],
    ProductCupons: [] // No existe en backend aún
  };
};

// Mapper: Frontend → Backend CreateProductDto
export const mapFrontendToCreateDto = (frontendProduct: Partial<import('../types/interface').ProductosProps>): CreateProductDto => {
  return {
    nombre: frontendProduct.ProductName || '',
    descripcion: frontendProduct.ProductDescription || '',
    inventario: frontendProduct.ProductStock || 0,
    precio: frontendProduct.productPrice || 0,
    categoria: frontendProduct.ProductCategory || '',
    color: frontendProduct.variants?.[0]?.valor || '#000000'
  };
};