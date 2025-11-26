'use client'

import { useDescuentoStore } from "../stores/useDescuentoStore"
import { useEffect, useState } from 'react'

export const useDescuentos = () => {
    const store = useDescuentoStore()
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    return {
        Descuentos: isHydrated ? store.descuentos : [],
        addDescuento: store.addDescuento,
        updateDescuento: store.updateDescuento,
        deleteDescuento: store.deleteDescuento,
        getDescuento: store.getDescuento
    }
}