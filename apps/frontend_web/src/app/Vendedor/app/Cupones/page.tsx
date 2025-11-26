'use client'
import { Plantilla } from '../../components/plantilla'
import React, { useState } from 'react'
import TableroCupones from './Componentes/tableroCupones'
import { Separator } from '../../../../components/ui/separator'
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '../../../../components/ui/sheet'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { BtnLink } from '../../components/primitivos'
import { useCupons } from '../../../../hooks/useCupons'
import { useProducts } from '../../../../hooks/useProduct'
import { Filtros } from '../../components/filtros'
import { CuponProps } from '../../../../types/interface'
import { CouponSheet } from './Componentes/CouponSheet'

export default function Cupones() {
  const { Cupons, addCupon } = useCupons()
  const { Products } = useProducts();
  
  // Estado para cupones filtrados
  const [filteredCupons, setFilteredCupons] = useState<CuponProps[]>(Cupons)
  
  const [formData, setFormData] = useState({
    CuponCode: '',
    TimesUsed: 0,
    CuponStatus: 0,
    EndDate: 'string',
    Discount: 0,
    ProductsId: [] as number[]
  })

  // Función para recibir los cupones filtrados del componente Filtros
  const handleFilteredCupons = (filtered: CuponProps[]) => {
    setFilteredCupons(filtered)
  }

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = parseInt(e.target.value);
    if (productId && !formData.ProductsId.includes(productId)) {
      setFormData({
        ...formData,
        ProductsId: [...formData.ProductsId, productId]
      })

      e.target.value = ""
    }
  }

  const removeProduct = (productId: number) => {
    setFormData({
      ...formData,
      ProductsId: formData.ProductsId.filter(id => id !== productId)
    })
  }

  const productsAvailables = Products.filter(
    product => !formData.ProductsId.includes(product.ProductID)
  )

  const handleSubmit = () => {
    const newCupon = {
      CuponCode: formData.CuponCode,
      TimesUsed: formData.TimesUsed,
      CuponStatus: formData.CuponStatus,
      EndDate: formData.EndDate,
      Discount: formData.Discount,
      CuponProductsId: formData.ProductsId
    }

    addCupon(newCupon)
  }

  return (
    <Plantilla title='Cupones'>
      <div className='-mt-7'>
        <div className='flex place-content-end'>
          <Sheet>
            <SheetTrigger asChild>
              <BtnLink className="">
                Crear cupón
              </BtnLink>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-md w-full p-0">
              <div className="h-full max-h-screen overflow-y-auto p-6">
                <SheetPrimitive.Title asChild>
                  <h2 className="text-lg font-semibold">Nuevo cupón</h2>
                </SheetPrimitive.Title>
                <p className="text-gray-500 text-sm mb-6">Crea y asigna cupones</p>
                <Separator className='my-4' />
                <form className="space-y-4" >
                  {/* Cupón */}
                  <div className='flex items-center'>
                    <label className="text-sm font-medium text-gray-700 text-end me-3 basis-1/3">Cupón</label>
                    <input
                      type="text"
                      className=" basis-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      placeholder="Código del cupón"
                      onChange={(e) => setFormData({ ...formData, CuponCode: e.target.value })}
                    />
                  </div>
                  {/* Fecha de expiración */}
                  <div className='flex items-center'>
                    <label className="block text-end text-sm font-medium text-gray-700 mb-1 basis-1/3 me-3">Fecha de expiración</label>
                    <input
                      type="date"
                      className="block basis-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })}
                    />
                  </div>
                  {/* Productos */}
                  {Products.length > 0 ? (
                    <div className='space-y-3'>
                      <div className='flex items-center'>
                        <label className="block text-end text-sm font-medium text-gray-700 mb-1 basis-1/3 me-3">
                          Productos
                        </label>
                        <select
                          onChange={handleProductSelect}
                          className="block basis-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                          defaultValue=""
                        >
                          <option value="" disabled>Seleccionar producto</option>
                          {productsAvailables.map((product) => (
                            <option key={product.ProductID} value={product.ProductID}>
                              {product.ProductName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tags/Chips de productos seleccionados */}
                      {formData.ProductsId.length > 0 && (
                        <div className="ml-1/3 pl-3">
                          <div className="flex flex-wrap gap-2">
                            {formData.ProductsId.map((productId) => {
                              const product = Products.find(p => p.ProductID === productId)
                              return (
                                <span
                                  key={productId}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                  {product?.ProductName}
                                  <button
                                    type="button"
                                    onClick={() => removeProduct(productId)}
                                    className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                  >
                                    ×
                                  </button>
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='font-medium text-gray-700 text-center'>
                      Aun no hay productos agregados
                      <BtnLink link="Productos/Agregar" className=''>Crear producto</BtnLink>
                    </div>
                  )}
                  {/* Status */}
                  <div className='flex items-center'>
                    <label className="block text-end text-sm font-medium text-gray-700 mb-1 basis-1/3 me-3">Status</label>
                    <select
                      onChange={(e) => setFormData({ ...formData, CuponStatus: parseInt(e.target.value) })}
                      className="block basis-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      defaultValue="Status"
                    >
                      <option disabled>Status</option>
                      <option value={1}>Activo</option>
                      <option value={2}>Borrado</option>
                      <option value={3}>Caducado</option>
                    </select>
                  </div>
                  {/* Off */}
                  <div className='flex items-center'>
                    <label className="text-sm font-medium text-gray-700 text-end me-3 basis-1/3">Descuento</label>
                      <input
                        type="number"
                        min={0}
                        max={100}

                        className=" basis-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        placeholder="Porcentaje de descuento"
                        onChange={(e) => setFormData({ ...formData, Discount: parseFloat(e.target.value) || 0})}
                      />
                  </div>
                  {/* Botón */}
                  <div className='flex justify-end'>
                    <SheetClose className='' asChild>
                      <BtnLink className="px-4" onClick={handleSubmit}>
                        Crear cupón
                      </BtnLink>
                    </SheetClose>
                  </div>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Separator className='my-2' />
      </div>
      <div>
        <Filtros onFilteredCupons={handleFilteredCupons} />
      </div>
      <div className='mt-5'>
        <TableroCupones entradas={filteredCupons} />
      </div>
    </Plantilla>
  )
}