'use client'
import Link from 'next/link';
import React from 'react'
import { TableCell, TableRow } from '../../../components/ui/table';
import { CuponesPropsFront, DescuentosPropsFront, OrdenesProps, ProductosPropsFront } from '@/types/interface'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../../../components/ui/sheet';
import { FaInfo } from 'react-icons/fa6';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FaTrash, FaCaretUp } from "react-icons/fa6";
import { useProducts } from '@/hooks/useProduct';
import { useCupons } from '@/hooks/useCupons';
import { useDescuentos } from '@/hooks/useDescuentos';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Title = ({ children, size = "xl", className }: { children: React.ReactNode, size?: string, className?: string }) => {
  return (
    <h1 className={`font-semibold text-${size} mb-2 ${className}`}>{children}</h1>
  )
}

export const BtnLink = ({ link, children, className, onClick }: { link?: string; children: React.ReactNode; className?: string; onClick?: () => void }) => {
  return (
    <Link
      href={link || ""}
      className={`p-1.5 text-white border-1 border-black rounded-sm bg-linear-to-t from-[#23272F] to-[#303540] inset-shadow-white px-2 py-1 ${className}`}
      onClick={onClick}
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

export const Descuento = ({ DescuentoID, DescuentoName, TimesUsed, DescuentoStatus, EndDate, variant = 'full' }: DescuentosPropsFront) => {
  const { deleteDescuento } = useDescuentos()
  
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
        <TableRow key={DescuentoID}>
          <TableCell>{DescuentoName}</TableCell>
          <TableCell>{TimesUsed}</TableCell>
          <TableCell>
            {getStatusBadge(DescuentoStatus)}
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
                  <AlertDialogTitle>¿Seguro que quieres eliminar {DescuentoName}?</AlertDialogTitle>
                  <AlertDialogDescription>Esto hará que el descuento no se pueda volver a usar</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className='bg-red-700' onClick={() => deleteDescuento(DescuentoID)}>Borrar</AlertDialogAction>
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
                  <SheetTitle>{DescuentoName}</SheetTitle>
                  <SheetDescription>
                    Detalles del descuento
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
                      {getStatusBadge(DescuentoStatus)}
                    </div>
                  </div>
                  <div className='flex mt-3.5'>
                    <div className='w-full'>Fecha de expiración</div>
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
          <div className='w-fit px-2 py-1 rounded-3xl bg-[#F3F4F6] font-medium'>{DescuentoName}</div>
          <div className='w-full flex place-content-end me-3 font-medium'>{TimesUsed}</div>
        </div>
      )

    default:
      return null;
  }
}

export const Producto = ({ ProductID, productPrice, ProductDescription, ProductImageUrl, ProductName, ProductBrand, ProductStatus, ProductStock, ProductCategory, ProductSellerName, variant = 'full', ProductSold, ProductSlug }: ProductosPropsFront) => {
  const { deleteProduct } = useProducts()

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
          <TableCell>
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

            <Sheet>
              <SheetTrigger asChild>
                <Button className='bg-blue-700 rounded-2xl ml-2 w-[38px] h-[38px] p-0'>
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
                <SheetFooter>
                  <SheetClose asChild>
                  </SheetClose>
                </SheetFooter>
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

