import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ProductosProps } from '../types/interface'

interface ProductState {
  getProductsByCategory(arg0: string): ProductosProps[];
  products: ProductosProps[];
  nextId: number;
  
  // Nueva propiedad para el producto seleccionado
  selectedProduct: ProductosProps | null;

  //insert
  addProducts: (newProducts: Omit<ProductosProps, 'ProductID'>[]) => void
  addProduct: (newProduct: Omit<ProductosProps, 'ProductID'>) => void;

  //update
  updateProduct: (id:number, updates: Partial<ProductosProps>) => void

  //delete
  deleteProduct: (id:number) => void;

  //read
  getProducts: () => ProductosProps[]
  getProduct: (id:number) => ProductosProps | undefined
  
  // Nuevas funciones para manejar la selección
  selectProduct: (id: number) => void;
  getSelectedProduct: () => ProductosProps | null;
  clearSelectedProduct: () => void;
  
  // Función para obtener categorías
  getCategories: () => string[];
}

export const useProductsStore = create<ProductState>()(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        nextId: 1,
        selectedProduct: null, // Inicializamos como null

       addProduct: (newProduct) => set((state) => {
          const productWithId = {
            ...newProduct,
            ProductID: state.nextId
          };
          return {
            products: [...state.products, productWithId],
            nextId: state.nextId + 1
          };
        }, false, 'addProduct'),

        addProducts: (newProducts) => set((state) => {
          const productsWithIds = newProducts.map((product, index) => ({
            ...product,
            ProductID: state.nextId + index
          }));
          return {
            products: [...state.products, ...productsWithIds],
            nextId: state.nextId + newProducts.length
          };
        }, false, 'addProducts'),

        updateProduct: (id, updates) => set((state)=>({
          products: state.products.map(product=>
            product.ProductID === id ? {...product, ...updates} : product
          )
        }), false, 'updateProduct'),

        deleteProduct: (id) => set((state)=>({
          products: state.products.filter(product=> product.ProductID !== id)
        }), false, 'deleteProduct'),

        getProducts: () => get().products,

        getProduct: (id) => get().products.find(product=> product.ProductID === id),

        getProductsByCategory: (category: string) => 
          get().products.filter(product => product.ProductCategory === category),

        // Función para seleccionar un producto específico
        selectProduct: (id) => set((state) => {
          const product = state.products.find(p => p.ProductID === id);
          return {
            selectedProduct: product || null
          };
        }, false, 'selectProduct'),

        // Función para obtener el producto seleccionado
        getSelectedProduct: () => get().selectedProduct,

        // Función para limpiar la selección (útil cuando sales de la vista de detalle)
        clearSelectedProduct: () => set(() => ({
          selectedProduct: null
        }), false, 'clearSelectedProduct'),

        // Obtener todas las categorías únicas
        getCategories: () => {
          const categories = get().products.map(product => product.ProductCategory);
          return [...new Set(categories)].filter(Boolean); // Elimina duplicados y valores falsy
        }
      }),
      {
        name: 'product-storage',
        partialize: (state)=> ({
          products: state.products,
          nextId: state.nextId
          // Nota: No persistimos selectedProduct porque debe resetearse al recargar
        })
      }
    ),
    {name:'ProductsStore'}
  )
)