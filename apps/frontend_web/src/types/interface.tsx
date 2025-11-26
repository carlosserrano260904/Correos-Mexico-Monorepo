import { HTMLAttributes, ReactNode } from "react";

type TipoVariante = 'Color' | 'Talla';
type Categoria = 'Electrónica' | 'Ropa' | 'Hogar';
type PackageStatus = 'Orden procesada' | 'Pago confirmado' | 'Paquete enviado' | 'Paquete en camino' | 'Paquete entregado';
export interface SumatoriaOrdenProps{
  subtotal: number,
  envio: number | string,
  Total: number
}

export interface UserAddressDeriveryProps{
  Nombre:string,
  Apellido:string,
  Calle:string,
  Numero:string,
  CodigoPostal:string,
  Estado:string,
  Municipio:string,
  Ciudad:string,
  Colonia:string,
  NumeroDeTelefono:string,
  InstruccionesExtra:string,
}

export interface PaymentMethodProps{
  id: number,
  NombreDeTarjeta: string,
  NumeroDeTarjeta: string,
  FechaVencimiento: string,
  CodigoSeguridad: string,
  TipoTarjeta: string,
  Banco: string
}



export interface FormularioProductoData {
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: Categoria | '';
  marca: string;
  tipo: TipoVariante | '';
  valor: string;
  inventario: number;
  imagenes: File[];
  sku: string;
}

export interface OrdenesProps  {
  OrderID: number
  OrderInfo: ProductoOrden[] 
  NoProducts:number
  OrderStatus: number
  OrderTotal: number
  OrderDate: string
  PaymentMethod: string
  ClientName: string
  Email: string
  PhoneNumber: number
  PackageStatus: PackageStatus
}

export interface CuponProps {
  CuponID: number,
  CuponCode: string,
  TimesUsed: number,
  CuponStatus: number,
  Discount: number,
  EndDate: string,
  CuponProductsId: number[]
}

export type CuponesPropsFront = Pick<CuponProps, 'CuponID' | 'CuponCode' | 'CuponStatus' | 'EndDate' | 'TimesUsed'> & {
  variant?: 'full' | 'compact'
}

export interface DescuentoProps {
  DescuentoID: number,
  DescuentoName: string,
  TimesUsed: number,
  DescuentoStatus: number,
  DiscountAmount: number,
  EndDate: string,
  DescuentoProductsId: number[]
}

export type DescuentosPropsFront = Pick<DescuentoProps, 'DescuentoID' | 'DescuentoName' | 'DescuentoStatus' | 'EndDate' | 'TimesUsed'> & {
  variant?: 'full' | 'compact'
}

type ProductoOrden = Pick<ProductosProps, 'ProductID' | 'ProductImageUrl' | 'ProductName' | 'ProductBrand' | 'productPrice' > & {
  ProductQuantity: number,
}

export interface ProductosProps {
  ProductID: number,
  ProductImageUrl: string,
  productPrice: number,
  ProductName: string,
  ProductDescription: string,
  ProductSlug: string,
  ProductBrand: string,
  ProductStatus: boolean,
  ProductStock: number,
  ProductCategory: string,
  ProductSellerName: string,
  ProductSold: number,
  variants: {
    tipo: string,
    price: number
    valor: string,
    inventario: number,
    sku: string
  }[]
  ProductCupons: number[]
}

export type ItemCartProps = Pick<ProductosProps, 'ProductImageUrl'|'ProductName'|'productPrice'> & {
  prodcutQuantity?: number
}

export type FormProductProps = Pick<ProductosProps, 'ProductName' | 'ProductDescription' | 'ProductSlug' | 'ProductBrand' | 'ProductCategory' | 'variants' | 'productPrice'>

export type ProductosPropsFront = Pick<ProductosProps, 'ProductBrand'| 'productPrice' | 'ProductCategory'| 'ProductSlug' | 'ProductID' | 'ProductImageUrl' | 'ProductName' | 'ProductSellerName' | 'ProductStatus' | 'ProductStock' | 'ProductSold'| 'ProductDescription'> & {
  variant?: 'full' | 'compact'
}

export interface CardsResumen {
   icon: React.ElementType;
    Card_titulo: string;
    Card_valor: number | string;
    Card_cambio: number;
    Card_activo: boolean;
    onClick: () => void;
}

type ProductColorsArray = {
  color: string[]
}
export interface ProductCardProps{
  ProductID: number
  ProductImage: string
  ProductColors: string[]
  ProductName: string
  ProductPrice: number
  onClick?: () => void;
}

export interface ColetcionCardProps{
  ProductID: number
  ProductImage: string
  ProductName: string
  onClick?: () => void;
}

export interface CategoryItemProps {
  imageSrc: string;
  label: string;
}
export interface Category {
  imageSrc: string;
  label: string;
}

export interface CategoriesCarouselProps {
  categories: Category[];
}
export interface CarouselProps {
  children: ReactNode;
  className?: string;
}

export interface CarouselContentProps {
  children: ReactNode;
  className?: string;
}

export interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

export type CarouselButtonProps = HTMLAttributes<HTMLButtonElement>;