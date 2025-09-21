import { devtools, persist } from 'zustand/middleware'
import { create } from 'zustand'
import { DescuentoProps } from '../types/interface'

interface DescuentoState {
    descuentos: DescuentoProps[];
    nextId: number;
    //insert
    addDescuento: (newDescuento: Omit<DescuentoProps, 'DescuentoID'>) => void;
    //update
    updateDescuento: (id: number, updates: Partial<DescuentoProps>) => void;
    //delete
    deleteDescuento: (id: number) => void;
    //read
    getDescuento: (id: number) => DescuentoProps | undefined
}

export const useDescuentoStore = create<DescuentoState>()(
    devtools(
        persist(
            (set, get) => ({
                descuentos: [],
                nextId: 1,
                addDescuento: (newDescuento) => set((state) => {
                    const descuentoWithId = {
                        ...newDescuento,
                        DescuentoID: state.nextId
                    };
                    return {
                        descuentos: [...state.descuentos, descuentoWithId],
                        nextId: state.nextId + 1
                    };
                }, false, 'addDescuento'),
                updateDescuento: (id, updates) => set((state) => ({
                    descuentos: state.descuentos.map(descuento =>
                        descuento.DescuentoID === id ? { ...descuento, ...updates } : descuento
                    )
                }), false, 'updateDescuento'),
                deleteDescuento: (id) => set((state) => ({
                    descuentos: state.descuentos.filter(descuento => descuento.DescuentoID !== id)
                }), false, 'deleteDescuento'),
                getDescuento: (id) => get().descuentos.find(descuento => descuento.DescuentoID === id)
            }),
            {
                name: 'descuento-storage',
                partialize: (state) => ({
                    descuentos: state.descuentos,
                    nextId: state.nextId
                })
            }
        ),
        { name: 'DescuentosStore' }
    )
)
