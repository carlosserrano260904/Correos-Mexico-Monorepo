'use client'
import { useListsStore } from '../stores/useListsStore'

export const useLists = () => {
  const store = useListsStore()
  
  return {
    // State
    Lists: store.lists,
    
    // Insert
    createList: store.createList,
    addProductToList: store.addProductToList,
    
    // Update
    updateListName: store.updateListName,
    
    // Delete
    deleteList: store.deleteList,
    removeProductFromList: store.removeProductFromList,
    clearList: store.clearList,
    
    // Read
    getLists: store.getLists,
    getList: store.getList,
    getListProducts: store.getListProducts,
    getTotalLists: store.getTotalLists,
    getListProductCount: store.getListProductCount,
    getListCoverImage: store.getListCoverImage,
    isProductInList: store.isProductInList
  }
}