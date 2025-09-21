import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FrontendProduct, BackendCreateProductDto } from '@/schemas/products' // ← Cambiar import
import { productsApiService } from '../services/productsApi'
import { mapFrontendToCreateDto } from '../utils/mappers'

interface ProductState {
  products: FrontendProduct[] // ← Cambiar tipo
  selectedProduct: FrontendProduct | null // ← Cambiar tipo
  loading: boolean
  error: string | null
  isConnected: boolean

  // Actions
  loadProducts: () => Promise<void>
  loadProduct: (id: number) => Promise<void>
  selectProduct: (productId: number) => void
  addProduct: (newProduct: Omit<FrontendProduct, 'ProductID'>, file?: File) => Promise<void> // ← Cambiar tipo
  updateProduct: (id: number, updates: Partial<FrontendProduct>) => Promise<void> // ← Cambiar tipo
  deleteProduct: (id: number) => Promise<void>
  
  // Read operations
  getProducts: () => FrontendProduct[] // ← Cambiar tipo
  getProduct: (id: number) => FrontendProduct | undefined // ← Cambiar tipo
  hasSelectedProduct: () => boolean
  clearError: () => void
  checkConnection: () => Promise<void>
}

export const useProductsStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      selectedProduct: null,
      loading: false,
      error: null,
      isConnected: false,

      // Cargar todos los productos desde la API con validación Zod
      loadProducts: async () => {
        set({ loading: true, error: null })
        
        try {
          // Directamente intentar cargar productos - el error de conexión se manejará en el catch
          const products = await productsApiService.getAllProducts()
          set({ 
            products, 
            loading: false, 
            error: null,
            isConnected: true // Actualizar estado de conexión exitosa
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar productos'
          set({ 
            error: errorMessage,
            loading: false,
            products: [], // Limpiar productos en caso de error
            isConnected: false // Actualizar estado de conexión fallida
          })
          console.error('Error loading products:', error)
        }
},

      // Cargar un producto específico desde la API
      loadProduct: async (id: number) => {
        set({ loading: true, error: null })
        
        try {
          const product = await productsApiService.getProductById(id)
          set({ selectedProduct: product, loading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar producto'
          set({ 
            error: errorMessage,
            loading: false 
          })
          console.error('Error loading product:', error)
        }
      },

      // Seleccionar un producto del estado local
      selectProduct: (productId: number) => {
        const product = get().products.find(p => p.ProductID === productId)
        if (product) {
          set({ selectedProduct: product })
        } else {
          set({ error: `Producto con ID ${productId} no encontrado` })
        }
      },

      // Agregar nuevo producto con validación Zod
      addProduct: async (newProduct, file) => {
        set({ loading: true, error: null })
        
        try {
          // Mapear y validar los datos del producto
          const createDto = mapFrontendToCreateDto(newProduct)
          
          const createdProduct = await productsApiService.createProduct(createDto)
          
          set(state => ({
            products: [...state.products, createdProduct],
            loading: false
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear producto'
          set({ 
            error: errorMessage,
            loading: false 
          })
          console.error('Error adding product:', error)
        }
      },

      // Actualizar producto con validación Zod
      updateProduct: async (id: number, updates: Partial<FrontendProduct>) => {
        set({ loading: true, error: null })
        
        try {
          await productsApiService.updateProduct(id, updates)
          
          // Recargar productos para obtener los datos actualizados
          await get().loadProducts()
          
          set({ loading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar producto'
          set({ 
            error: errorMessage,
            loading: false 
          })
          console.error('Error updating product:', error)
        }
      },

      // Eliminar producto
      deleteProduct: async (id: number) => {
        set({ loading: true, error: null })
        
        try {
          await productsApiService.deleteProduct(id)
          
          set(state => ({
            products: state.products.filter(product => product.ProductID !== id),
            selectedProduct: state.selectedProduct?.ProductID === id ? null : state.selectedProduct,
            loading: false
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar producto'
          set({ 
            error: errorMessage,
            loading: false 
          })
          console.error('Error deleting product:', error)
        }
      },

      // Operaciones de lectura (mantenemos compatibilidad)
      getProducts: () => get().products,
      getProduct: (id: number) => get().products.find(product => product.ProductID === id),
      hasSelectedProduct: () => get().selectedProduct !== null,
      clearError: () => set({ error: null })
    }),
    { 
      name: 'ProductsStore',
      // Opciones adicionales para debugging
      serialize: {
        options: {
          map: true,
        }
      }
    }
  )
)