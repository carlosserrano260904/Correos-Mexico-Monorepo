import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ProductosProps } from '../types/interface'

export interface ListaProps {
  ListaID: number;
  ListaName: string;
  ListaProducts: ProductosProps[];
  ListaCreatedAt: string;
}

interface ListsState {
  lists: ListaProps[];
  nextId: number;
  
  // Insert
  createList: (name: string) => void;
  addProductToList: (listId: number, product: ProductosProps) => void;
  
  // Update
  updateListName: (listId: number, newName: string) => void;
  
  // Delete
  deleteList: (listId: number) => void;
  removeProductFromList: (listId: number, productId: number) => void;
  clearList: (listId: number) => void;
  
  // Read
  getLists: () => ListaProps[];
  getList: (listId: number) => ListaProps | undefined;
  getListProducts: (listId: number) => ProductosProps[];
  getTotalLists: () => number;
  getListProductCount: (listId: number) => number;
  getListCoverImage: (listId: number) => string;
  isProductInList: (listId: number, productId: number) => boolean;
}

export const useListsStore = create<ListsState>()(
  devtools(
    persist(
      (set, get) => ({
        lists: [],
        nextId: 1,
        
        createList: (name) => set((state) => {
          const newList: ListaProps = {
            ListaID: state.nextId,
            ListaName: name,
            ListaProducts: [],
            ListaCreatedAt: new Date().toISOString()
          };
          
          return {
            lists: [...state.lists, newList],
            nextId: state.nextId + 1
          };
        }, false, 'createList'),
        
        addProductToList: (listId, product) => set((state) => ({
          lists: state.lists.map(list => 
            list.ListaID === listId
              ? {
                  ...list,
                  ListaProducts: list.ListaProducts.some(p => p.ProductID === product.ProductID)
                    ? list.ListaProducts // No agregar duplicados
                    : [...list.ListaProducts, product]
                }
              : list
          )
        }), false, 'addProductToList'),
        
        updateListName: (listId, newName) => set((state) => ({
          lists: state.lists.map(list =>
            list.ListaID === listId
              ? { ...list, ListaName: newName }
              : list
          )
        }), false, 'updateListName'),
        
        deleteList: (listId) => set((state) => ({
          lists: state.lists.filter(list => list.ListaID !== listId)
        }), false, 'deleteList'),
        
        removeProductFromList: (listId, productId) => set((state) => ({
          lists: state.lists.map(list =>
            list.ListaID === listId
              ? {
                  ...list,
                  ListaProducts: list.ListaProducts.filter(p => p.ProductID !== productId)
                }
              : list
          )
        }), false, 'removeProductFromList'),
        
        clearList: (listId) => set((state) => ({
          lists: state.lists.map(list =>
            list.ListaID === listId
              ? { ...list, ListaProducts: [] }
              : list
          )
        }), false, 'clearList'),
        
        getLists: () => get().lists,
        
        getList: (listId) => get().lists.find(list => list.ListaID === listId),
        
        getListProducts: (listId) => {
          const list = get().lists.find(list => list.ListaID === listId);
          return list ? list.ListaProducts : [];
        },
        
        getTotalLists: () => get().lists.length,
        
        getListProductCount: (listId) => {
          const list = get().lists.find(list => list.ListaID === listId);
          return list ? list.ListaProducts.length : 0;
        },
        
        getListCoverImage: (listId) => {
          const list = get().lists.find(list => list.ListaID === listId);
          return list && list.ListaProducts.length > 0 
            ? list.ListaProducts[0].ProductImageUrl
            : '/blusa.png'; // Imagen por defecto
        },
        
        isProductInList: (listId, productId) => {
          const list = get().lists.find(list => list.ListaID === listId);
          return list ? list.ListaProducts.some(p => p.ProductID === productId) : false;
        }
      }),
      {
        name: 'lists-storage',
        partialize: (state) => ({
          lists: state.lists,
          nextId: state.nextId
        })
      }
    ),
    { name: 'ListsStore' }
  )
)