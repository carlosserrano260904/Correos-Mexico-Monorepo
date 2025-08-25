import { HTMLAttributes, ReactNode } from "react"

// Import types first before using them
import { 
  FrontendProduct,
  BackendProductEntity,
  BackendCreateProductDto,
  BackendUpdateProductDto
} from '../schemas/products'

import {
  FrontendFavorite,
  FrontendFavorites,
  BackendFavorito,
  BackendFavoritesResponse,
  BackendCreateFavoritoDto,
} from '../schemas/favorites'

// Re-export all the imported types
export type {
  FrontendProduct,
  BackendProductEntity,
  BackendCreateProductDto,
  BackendUpdateProductDto,
  FrontendFavorite,
  FrontendFavorites,
  BackendFavorito,
  BackendFavoritesResponse,
  BackendCreateFavoritoDto,
}

// Extended ProductosProps with optional favorite fields
export interface ProductosProps extends FrontendProduct {
  // Optional favorite-specific fields (when item is from favorites)
  FavoriteId?: number;
  DateAdded?: string;
}

// ... resto de tus types existentes


export interface CardsResumen {
  icon: React.ElementType
  Card_titulo: string
  Card_valor: number | string
  Card_cambio: number
  Card_activo: boolean
  onClick: () => void
}

export interface ProductCardProps {
  ProductID: number
  ProductImage: string
  ProductColors: string[]
  ProductName: string
  ProductPrice: number
  onClick?: () => void
}

export interface ColetcionCardProps {
  ProductImage: string
  ProductName: string
  onClick?: () => void
}

export interface CategoryItemProps {
  imageSrc: string
  label: string
}

export interface Category {
  imageSrc: string
  label: string
}

export interface CategoriesCarouselProps {
  categories: Category[]
}

export interface CarouselProps {
  children: ReactNode
  className?: string
}

export interface CarouselContentProps {
  children: ReactNode
  className?: string
}

export interface CarouselItemProps {
  children: ReactNode
  className?: string
}

export type CarouselButtonProps = HTMLAttributes<HTMLButtonElement>

// ===== TIPOS DE VALIDACIÓN Y ERRORES =====
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  validationErrors?: ValidationError[]
}

// ===== TIPOS DE ESTADO GLOBAL =====
export interface AppState {
  isLoading: boolean
  error: string | null
  isConnected: boolean
}

// ===== CONSTANTES DE TIPOS =====
export const CATEGORIAS = ['Electrónica', 'Ropa', 'Hogar'] as const
export const TIPOS_VARIANTE = ['Color', 'Talla'] as const
export const PACKAGE_STATUSES = [
  'Orden procesada',
  'Pago confirmado', 
  'Paquete enviado',
  'Paquete en camino',
  'Paquete entregado'
] as const

// ===== TIPOS UTILITARIOS =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
