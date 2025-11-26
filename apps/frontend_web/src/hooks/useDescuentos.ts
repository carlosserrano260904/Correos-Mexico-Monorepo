'use client'

import { useDescuentoStore } from "../stores/useDescuentoStore"

export const useDescuentos = () => {
    const store = useDescuentoStore()

    return {
        Descuentos: store.descuentos,
        addDescuento: store.addDescuento,
        updateDescuento: store.updateDescuento,
        deleteDescuento: store.deleteDescuento,
        getDescuento: store.getDescuento
    }
}
