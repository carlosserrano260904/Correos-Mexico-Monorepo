import { devtools, persist } from 'zustand/middleware'
import { create } from 'zustand'
import {CuponProps} from '../types/interface'

interface CuponState{
    cupons : CuponProps[];
    nextId: number;
    //insert
    addCupon: (newCupon: Omit<CuponProps, 'CuponID'>) => void;
    //update
    updateCupon: (id:number, updates: Partial<CuponProps>) => void;
    //delete
    deleteCupon: (id:number) => void;
    //read
    getCupon: (id:number) => CuponProps | undefined
}

export const useCuponStore = create<CuponState>()(
    devtools(
        persist(
            (set,get)=> ({
            cupons: [],
            nextId:1,
            addCupon: (newCupon) => set((state) => {
                const cuponWithId = {
                    ...newCupon,
                    CuponID: state.nextId
                };
                return {
                    cupons: [...state.cupons, cuponWithId],
                    nextId: state.nextId + 1
                };
                }, false, 'addCupon'),
            updateCupon: (id, updates) => set((state)=> ({
                cupons: state.cupons.map(cupon=>
                    cupon.CuponID === id ? {...cupon, ...updates} : cupon
                )
            }), false, 'updateCupon'),
            deleteCupon: (id) => set((state)=>({
                cupons: state.cupons.filter(cupon=>cupon.CuponID !== id)
            }), false, 'deleteCupon'),
            getCupon: (id) => get().cupons.find(cupon=>cupon.CuponID===id)
            }),
            {
                name: 'cupon-storage',
                partialize: (state)=>({
                    cupons: state.cupons,
                    nextId: state.nextId
                })
            }
        ),
        {name: 'CuponsStore'}
    )
)