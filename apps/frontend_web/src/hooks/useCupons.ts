'use client'

import { useCuponStore } from "../stores/useCuponStore"

export const useCupons = () =>{
    const store = useCuponStore()

    return{
        Cupons:store.cupons,
        addCupon:store.addCupon,
        updateCupon:store.updateCupon,
        deleteCupon:store.deleteCupon,
        getProduct:store.getProduct
    }
}