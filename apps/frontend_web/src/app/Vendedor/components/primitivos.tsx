'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { TableCell, TableRow } from '../../../components/ui/table';
import { CuponesPropsFront, DescuentosPropsFront, OrdenesProps, ProductosPropsFront } from '@/types/interface'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../../../components/ui/sheet';
import { FaInfo } from 'react-icons/fa6';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FaTrash, FaCaretUp, FaEdit } from "react-icons/fa6";
import { useProducts } from '@/hooks/useProduct';
import { useCupons } from '@/hooks/useCupons';
import { useDescuentos } from '@/hooks/useDescuentos';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';


  export const Title = ({ children, size = "xl", className }: { children: React.ReactNode, size?: string, className?: string }) => {
    return (
      <h1 className={`font-semibold text-${size} mb-2 ${className}`}>{children}</h1>
    )
  }

  export interface ProductoComponentProps extends ProductosPropsFront {
  variant?: 'full' | 'compact';
}

  type BtnLinkProps = {
  link?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  preventNavigation?: boolean; // ✅ nueva prop opcional
};

export const BtnLink: React.FC<BtnLinkProps> = ({
  link,
  children,
  className = '',
  onClick,
  preventNavigation = false,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Si preventNavigation es true, evitamos que el enlace navegue inmediatamente
    if (preventNavigation) {
      event.preventDefault();
    }
    // Ejecutamos el onClick del padre (si existe)
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Link
      href={link || ''}
      className={`p-1.5 text-white border-1 border-black rounded-sm bg-linear-to-t from-[#23272F] to-[#303540] inset-shadow-white px-2 py-1 ${className}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

  export const Cupon = ({ CuponID, CuponCode, TimesUsed, CuponStatus, EndDate, variant = 'full' }: CuponesPropsFront) => {
    const { deleteCupon } = useCupons()
    
    const getStatusBadge = (status: number) => (
      <span className={`w-max rounded-lg px-[6px] ${
        status === 1 ? 'text-green-400 bg-green-100' :
        status === 2 ? 'text-orange-400 bg-orange-100' :
        status === 3 ? 'text-red-400 bg-red-100' : ''
      }`}>
        {
          status === 1 ? 'Activo' :
          status === 2 ? 'Borrado' :
          status === 3 ? 'Caducado' : ''
        }
      </span>
    );

    switch (variant) {
      case 'full':
        return (
          <TableRow key={CuponID}>
            <TableCell>{CuponCode}</TableCell>
            <TableCell>{TimesUsed}</TableCell>
            <TableCell>
              {getStatusBadge(CuponStatus)}
            </TableCell>
            <TableCell>{EndDate}</TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='bg-red-700 rounded-2xl w-[38px] h-[38px] p-0'>
                    <FaTrash color='white' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Seguro que quieres eliminar {CuponCode}? </AlertDialogTitle>
                    <AlertDialogDescription>Esto hara que el cupon no se pueda volver a usar</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-700' onClick={() => deleteCupon(CuponID)}>Borrar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button className='bg-blue-700 rounded-2xl ml-2 w-[38px] h-[38px] p-0'>
                    <FaCaretUp color='white' size={14} />
                  </Button>
                </SheetTrigger>
                <SheetContent className='rounded-lg m-3 h-fit w-[800px]'>
                  <SheetHeader>
                    <SheetTitle>{CuponCode}</SheetTitle>
                    <SheetDescription>
                      Detalles del cupon
                      <Separator className='mt-2' />
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mx-5 mb-5 text-sm">
                    <div className='flex mt-3.5'>
                      <div className='w-full'>Veces usado</div>
                      <div className='w-full'>{TimesUsed}</div>
                    </div>
                    <div className='flex mt-3.5'>
                      <div className='w-full'>Estatus</div>
                      <div className='w-full'>
                        {getStatusBadge(CuponStatus)}
                      </div>
                    </div>
                    <div className='flex mt-3.5'>
                      <div className='w-full'>Fecha de expiracion</div>
                      <div className='w-full'>{EndDate}</div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </TableCell>
          </TableRow>
        )

      case 'compact':
        return (
          <div className='flex justify-between mb-1.5'>
            <div className='w-fit px-2 py-1 rounded-3xl bg-[#F3F4F6] font-medium'>{CuponCode}</div>
            <div className='w-full flex place-content-end me-3 font-medium'>{TimesUsed}</div>
          </div>
        )

      default:
        return null;
    }
  }

  export const Producto = ({ ProductID, productPrice, ProductDescription, ProductImageUrl, ProductName, ProductBrand, ProductStatus, ProductStock, ProductCategory, ProductSellerName, variant = 'full', ProductSold, ProductSlug, Color }: ProductoComponentProps) => {
    const { deleteProduct } = useProducts()

      const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
    ProductName: ProductName || '',
    ProductDescription: ProductDescription || '',
    productPrice: productPrice || 0,
    ProductStock: ProductStock || 0,
    ProductCategory: ProductCategory || '',
    Color: Color || '',
    ProductImageUrl: ProductImageUrl || ''
  })

   const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

 const handleSave = async () => {
  setIsLoading(true)
  try {
    console.log('🔍 Datos del formulario:', formData)

    // ✅ CREAR OBJETO FRONTEND PRODUCT PARCIAL para el mapper
    const frontendProductUpdate: Partial<FrontendProduct> = {
      ProductName: formData.ProductName,
      ProductDescription: formData.ProductDescription,
      ProductImageUrl: formData.ProductImageUrl,
      ProductStock: Number(formData.ProductStock),
      productPrice: Number(formData.productPrice),
      ProductCategory: formData.ProductCategory,
      Color: formData.Color,
    }
    
    console.log('🔍 Datos para enviar al mapper:', frontendProductUpdate)
    
    // ✅ USAR TU SERVICIO API QUE YA MANEJA EL MAPPING
    const result = await productsApiService.updateProduct(ProductID, frontendProductUpdate)
    console.log('✅ Respuesta del servidor:', result)
    
    setIsEditing(false)
    toast.success('Producto actualizado correctamente')
    
    // Opcional: recargar para ver los cambios
    window.location.reload()
  } catch (error:any) {
    console.error('❌ Error completo:', error)
    
    // Mejor manejo de errores
    let errorMessage = 'Error desconocido'
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    toast.error(`Error al actualizar el producto: ${errorMessage}`)
  } finally {
    setIsLoading(false)
  }
}

  const handleCancel = () => {
    // Restaurar valores originales
    setFormData({
      ProductName: ProductName || '',
      ProductDescription: ProductDescription || '',
      productPrice: productPrice || 0,
      ProductStock: ProductStock || 0,
      ProductCategory: ProductCategory || '',
      Color: Color || '',
      ProductImageUrl: ProductImageUrl || ''
    })
    setIsEditing(false)
  }

    switch (variant) {
      case 'full':
        return (
          <TableRow key={ProductID}>
            <TableCell className="flex">
              <img src={ProductImageUrl} className="h-16 w-16 m-2" ></img>
              <div className="content-center pl-2">
                <h3 className="text-lg">{ProductName}</h3>
                <p className="text-sm font-light text-gray-600">{ProductBrand}</p>
              </div>
            </TableCell>
            <TableCell>
              <p className={`w-max px-[10px] rounded-lg ${ProductStatus ? "text-green-500 bg-[#34D39933]" : "text-blue-950 bg-gray-200"}`}>
                {ProductStatus ? "Activo" : "Archivado"}
              </p>
            </TableCell>
            <TableCell>{ProductStock} en existencia</TableCell>
            <TableCell>{ProductCategory}</TableCell>
            <TableCell>{ProductSellerName}</TableCell>
            <TableCell >
  {/* Botón de eliminar (existing) */}
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className='bg-red-700 rounded-2xl w-[38px] h-[38px] p-0'>
        <FaTrash color='white' />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Seguro que quieres eliminar {ProductName}?</AlertDialogTitle>
        <AlertDialogDescription>Esto eliminara todas las publicaciones del producto y cualquier cosa relacionada con este producto</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction className='bg-red-700' onClick={() => deleteProduct(ProductID)}>Borrar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  {/* NUEVO BOTÓN DE EDITAR */}
  <Sheet>
    <SheetTrigger asChild className='mx-2'>
      <Button className='bg-green-700 rounded-2xl w-[38px] h-[38px] p-0'>
        <FaEdit color='white' size={14} />
      </Button>
    </SheetTrigger>
    <SheetContent className='rounded-lg m-3 h-fit w-[800px] overflow-y-auto'>
      <SheetHeader>
        <div className="flex items-center justify-between">
          <div>
            <SheetTitle>Editar Producto</SheetTitle>
            <SheetDescription>
              Modifica los detalles de {ProductName}
              <Separator className='mt-2' />
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mx-5 text-sm">
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="edit-name">Nombre del producto</Label>
            <Input
              id="edit-name"
              value={formData.ProductName}
              onChange={(e) => handleInputChange('ProductName', e.target.value)}
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={formData.ProductDescription}
              onChange={(e) => handleInputChange('ProductDescription', e.target.value)}
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-price">Precio</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.productPrice}
                onChange={(e) => handleInputChange('productPrice', Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="edit-stock">Inventario</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.ProductStock}
                onChange={(e) => handleInputChange('ProductStock', Number(e.target.value))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-category">Categoría</Label>
              <Select 
                value={formData.ProductCategory} 
                onValueChange={(value) => handleInputChange('ProductCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electrónica">Electrónica</SelectItem>
                  <SelectItem value="Ropa">Ropa</SelectItem>
                  <SelectItem value="Hogar">Hogar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-color">Color</Label>
              <Input
                id="edit-color"
                value={formData.Color}
                onChange={(e) => handleInputChange('Color', e.target.value)}
                placeholder="Color del producto"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-image">URL de la imagen</Label>
            <Input
              id="edit-image"
              value={formData.ProductImageUrl}
              onChange={(e) => handleInputChange('ProductImageUrl', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.ProductImageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.ProductImageUrl} 
                  className="w-32 h-32 object-cover rounded-md" 
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <SheetFooter className="mt-6">
        <div className="flex gap-2 w-full">
          <SheetClose asChild>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </SheetClose>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>

  {/* Botón de detalles (existing) - SIN CAMBIOS */}
  <Sheet>
    <SheetTrigger asChild>
      <Button className='bg-blue-700 rounded-2xl w-[38px] h-[38px] p-0'>
        <FaCaretUp color='white' size={14} />
      </Button>
    </SheetTrigger>
    <SheetContent className='rounded-lg m-3 h-fit w-[800px]'>
      <SheetHeader>
        <SheetTitle>{ProductName}</SheetTitle>
        <SheetDescription>
          Detalles del producto
          <Separator className='mt-2' />
        </SheetDescription>
      </SheetHeader>
      <div className="mx-5 text-sm">
        <div className='flex'>
          <div className='w-full'>Slug</div>
          <div className='w-full text-right'>{ProductSlug}</div>
        </div>
        <div className='flex mt-3.5'>
          <div className='w-full'>Descripcion</div>
          <div className='w-full text-right'>{ProductDescription}</div>
        </div>
        <div className='flex mt-3.5'>
          <div className='w-full'>Categoria</div>
          <div className='w-full text-right'>{ProductCategory}</div>
        </div>
        <div className='flex mt-3.5'>
          <div className='w-full'>Marca</div>
          <div className='w-full text-right'>{ProductBrand}</div>
        </div>
        <Separator className='mt-2' />
        <div className='flex mt-3.5'>
          <div className='w-full'>Precio</div>
          <div className='w-full text-right'>{productPrice}</div>
        </div>
        <div className='flex mt-3.5'>
          <div className='w-full'>Inventario</div>
          <div className='w-full text-right'>{ProductStock}</div>
        </div>
        <div className='flex mt-3.5'>
          <div className='w-full'>Imagenes</div>
          <div className='w-full text-right'><img src={ProductImageUrl} className="" ></img></div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</TableCell>
          </TableRow>
        )
        break;

      case 'compact':
        return (
          <div className='flex'>
            <div className='flex'>
              <img src={ProductImageUrl} className="h-16 w-16 m-2" ></img>
              <div className="content-center pl-2">
                <h3 className="text-lg">{ProductName}</h3>
                <p className="text-sm font-light text-gray-600">{ProductBrand}</p>
              </div>
            </div>
            <div className='ms-auto my-auto me-6'>
              <p className='text-end font-medium'>
                {ProductSold}
              </p>
              {ProductSold ? <p className='font-medium'>
                vendidos
              </p> : <></>}
            </div>
          </div>
        );
        break;
    }


  }

  export const Orden = ({ OrderID, OrderInfo, NoProducts, OrderStatus, OrderTotal, OrderDate, PaymentMethod, ClientName, Email, PhoneNumber, PackageStatus }: OrdenesProps) => {

    return (
      <TableRow key={OrderID}>
        <TableCell className="flex">#{OrderID}</TableCell>
        <TableCell className="max-w-32 break-words whitespace-normal">{OrderInfo.map((item) => (item.ProductName))}</TableCell>
        <TableCell>{NoProducts}</TableCell>
        <TableCell>
          <p className={`w-max rounded-lg px-[6px] ${OrderStatus === 1 ? 'text-green-400 bg-green-100' : OrderStatus === 2 ? 'text-orange-400 bg-orange-100' : OrderStatus === 3 ? 'text-red-400 bg-red-100' : ''}`}>
            {OrderStatus === 1 ? 'Completado' : OrderStatus === 2 ? 'Pendiente' : OrderStatus === 3 ? 'Cancelado' : ''}
          </p>
        </TableCell>
        <TableCell>${OrderTotal}</TableCell>
        <TableCell>{OrderDate}</TableCell>
        <TableCell>
          <Sheet>
            <SheetTrigger><FaInfo /></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>#{OrderID}</SheetTitle>
                <SheetDescription>
                  Detalles de la Orden
                </SheetDescription>
              </SheetHeader>
              <div className=' max-h-[160px] overflow-y-auto'>
                {OrderInfo.map((item) => (
                  <div className='flex m-2' key={item.ProductID}>
                    <div className='flex basis-2/4'>
                      <img src={item.ProductImageUrl} className="h-10 w-10 " />
                      <div className="content-center pl-2">
                        <h3 className="text-sm">{item.ProductName}</h3>
                        <p className="text-xs font-light text-gray-600">{item.ProductBrand}</p>
                      </div>
                    </div>
                    <div className='basis-1/4 flex items-center  text-sm'>
                      <p>{item.ProductQuantity} pz</p>
                    </div>
                    <div className='basis-1/4 flex items-center justify-center text-sm'>
                      <p>{item.productPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='m-4'>
                <div className='flex flex-row text-sm'>
                  <div className='basis-1/2'>
                    <p>Ordenado el: </p>
                    <p className='my-2'>Metodo de pago: </p>
                    <p>Status: </p>
                  </div>
                  <div className='basis-1/2'>
                    <p>{OrderDate}</p>
                    <p className='my-2'>{PaymentMethod}</p>
                    <p className={`w-max rounded-lg px-[6px]
                          ${OrderStatus === 1 ? 'text-green-400 bg-green-100' : OrderStatus === 2 ? 'text-orange-400 bg-orange-100' : OrderStatus === 3 ? 'text-red-400 bg-red-100' : ''}`}>
                      {OrderStatus === 1 ? 'Completado' : OrderStatus === 2 ? 'Pendiente' : OrderStatus === 3 ? 'Cancelado' : ''}
                    </p>
                  </div>
                </div>
                <div className='flex flex-row text-sm'>
                  <div className='basis-1/2'>
                    <p>Nombre del Cliente: </p>
                    <p className='my-2'>Correo Electronico: </p>
                    <p>Telefono: </p>
                  </div>
                  <div>
                    <p>{ClientName}</p>
                    <p className='my-2'>{Email}</p>
                    <p>{PhoneNumber}</p>
                  </div>
                </div>
                <>
                  {/* poner aqui el componente dela imagen */}
                  <div className="m-4">
                    <h3 className="text-sm font-medium mb-4">Status del paquete</h3>
                    <div className="space-y-2">
                      {['Orden procesada', 'Pago confirmado', 'Paquete enviado', 'Paquete en camino', 'Paquete entregado'].map((status) => (
                        <div key={status} className="flex items-start">
                          <div className={`h-4 w-4 rounded-full mt-1 mr-3 flex-shrink-0 ${status === PackageStatus ? 'bg-blue-500' : 'bg-gray-200'
                            }`} />
                          <div>
                            <p className={`text-sm ${status === PackageStatus ? 'font-medium text-gray-900' : 'text-gray-500'
                              }`}>
                              {status}
                            </p>
                            {status === 'Orden procesada' && (
                              <p className="text-xs text-gray-500">el pedido se está tramitando (los productos se están empacando)</p>
                            )}
                            {status === 'Pago confirmado' && (
                              <p className="text-xs text-gray-500">El pago ha sido validado y confirmado</p>
                            )}
                            {status === 'Paquete enviado' && (
                              <p className="text-xs text-gray-500">El paquete ha sido entregado a la paquetería</p>
                            )}
                            {status === 'Paquete en camino' && (
                              <p className="text-xs text-gray-500">El paquete está camino al destino</p>
                            )}
                            {status === 'Paquete entregado' && (
                              <p className="text-xs text-gray-500">El paquete ha sido entregado en el domicilio</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
                <div className=' flex flex-row'>
                  <div className='basis-1/2 justify-items-end'>
                    <p>total:</p>
                  </div>
                  <div className='basis-1/2 justify-items-end'>
                    <p>{OrderTotal}</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </TableCell>
      </TableRow>
    )
  }
  export const Card_titulo = ({ titulo }: { titulo: string }) => (
    <h3 className="text-lg font-semibold leading-none tracking-tight">
      {titulo}
    </h3>
  );

  export const Card_valor = ({ valor }: { valor: string | number }) => (
    <p className="text-3xl font-bold text-gray-900">{valor}</p>
  );

  export const Card_cambio = ({ cambio }: { cambio: number }) => (
    <p className={`text-sm ${cambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {cambio >= 0 ? `+${cambio.toFixed(2)}%` : `${cambio.toFixed(2)}%`}
    </p>
  );

