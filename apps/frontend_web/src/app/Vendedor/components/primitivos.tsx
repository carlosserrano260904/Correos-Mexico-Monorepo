  'use client'
  import Link from 'next/link';
  import React, { useState } from 'react'
  import { TableCell, TableRow } from '../../../components/ui/table';
  import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../../../components/ui/sheet';
  import { FaInfo } from 'react-icons/fa6';
  import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
  import { FaTrash, FaCaretUp } from "react-icons/fa6";
  import { useProducts } from '@/hooks/useProduct';
  import { useCupons } from '@/hooks/useCupons';
  import { Button } from '@/components/ui/button';
  import { Separator } from '@/components/ui/separator';
  import { productsApiService } from '@/services/productsApi'
  import { toast } from 'sonner'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Textarea } from '@/components/ui/textarea'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { FaEdit } from "react-icons/fa"
  
  // 🎯 NUEVOS IMPORTS - Schemas y Mappers
  import { 
    ProductoComponentSchema, 
    CuponFrontendSchema, 
    OrdenComponentSchema,
    type ProductoComponent,
    type CuponFrontend,
    type OrdenComponent,
    getStatusBadgeClass,
    getStatusText,
    formatPrice,
    formatDate
  } from '@/schemas/components';
  import { mapFrontendProductToComponent, validateComponentData } from '@/utils/componentMappers';
  import { FrontendProduct } from '@/schemas/products';


  export const Title = ({ children, size = "xl", className }: { children: React.ReactNode, size?: string, className?: string }) => {
    return (
      <h1 className={`font-semibold text-${size} mb-2 ${className}`}>{children}</h1>
    )
  }

  // ✅ USAMOS EL TIPO DEL SCHEMA EN LUGAR DE INTERFACE
  export type ProductoComponentProps = ProductoComponent;

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

  export const Cupon = ({ CuponID, CuponCode, TimesUsed, CuponStatus, EndDate, variant = 'full' }: CuponFrontend) => {
    const { deleteCupon } = useCupons()
    
    // ✅ USAMOS LOS HELPERS DEL SCHEMA
    const getStatusBadge = (status: number) => (
      <span className={`w-max rounded-lg px-[6px] ${getStatusBadgeClass(status)}`}>
        {getStatusText(status)}
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

  export const Producto = ({ 
    ProductID, 
    productPrice, 
    ProductDescription, 
    ProductImageUrl, 
    ProductName, 
    ProductBrand, 
    ProductStatus, 
    ProductStock, 
    ProductCategory, 
    ProductSellerName, 
    variant = 'full', 
    ProductSold, 
    ProductSlug, 
    Color, 
    ProductSKU,
    ProductImages,
    ProductCupons,
    // Nuevos campos opcionales
    ProductHeight,
    ProductLength, 
    ProductWidth,
    ProductWeight,
    ProductSellerId,
    ProductVolume,
    ProductDimensions,
    ProductWeightDisplay
  }: ProductoComponentProps) => {
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
    ProductImageUrl: ProductImageUrl || '',
    ProductBrand: ProductBrand || '',
    ProductSKU: ProductSKU || '',
    // Nuevos campos físicos
    ProductHeight: ProductHeight || undefined,
    ProductLength: ProductLength || undefined,
    ProductWidth: ProductWidth || undefined,
    ProductWeight: ProductWeight || undefined
  })

   const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      let processedValue: any = value;
      
      // Manejar campos de dimensiones físicas (convertir string vacío a undefined)
      if (['ProductHeight', 'ProductLength', 'ProductWidth', 'ProductWeight'].includes(field)) {
        if (typeof value === 'string') {
          processedValue = value.trim() === '' ? undefined : Number(value) || undefined;
        }
      }
      
      return {
        ...prev,
        [field]: processedValue
      };
    });
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
      ProductBrand: formData.ProductBrand,
      ProductSKU: formData.ProductSKU,
      Color: formData.Color,
      // Nuevos campos físicos (ya procesados por handleInputChange)
      ProductHeight: formData.ProductHeight,
      ProductLength: formData.ProductLength,
      ProductWidth: formData.ProductWidth,
      ProductWeight: formData.ProductWeight,
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
      ProductImageUrl: ProductImageUrl || '',
      ProductBrand: ProductBrand || '',
      ProductSKU: ProductSKU || '',
      // Nuevos campos físicos
      ProductHeight: ProductHeight || undefined,
      ProductLength: ProductLength || undefined,
      ProductWidth: ProductWidth || undefined,
      ProductWeight: ProductWeight || undefined
    })
    setIsEditing(false)
  }

    switch (variant) {
      case 'full':
        return (
          <TableRow key={ProductID}>
            <TableCell className="flex min-w-sm">
              <img src={ProductImageUrl} className="h-16 w-16 m-2" ></img>
              <div className="content-center pl-2">
                <h3 className="text-lg text-balance">{ProductName}</h3>
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
    <SheetContent className='rounded-lg m-3 w-[800px] flex flex-col h-[90hv]'>
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

      <div className="flex-1 overflow-y-auto mx-5 text-sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name" className='mb-2'>Nombre del producto</Label>
            <Input
              id="edit-name"
              value={formData.ProductName}
              onChange={(e) => handleInputChange('ProductName', e.target.value)}
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <Label htmlFor="edit-description" className='mb-2'>Descripción</Label>
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
              <Label htmlFor="edit-price" className='mb-2'>Precio</Label>
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
              <Label htmlFor="edit-stock" className='mb-2'>Inventario</Label>
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
              <Label htmlFor="edit-category" className='mb-2'>Categoría</Label>
              <Select 
                value={formData.ProductCategory} 
                onValueChange={(value) => handleInputChange('ProductCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Joyeria y Bisuteria">Joyeria y Bisuteria</SelectItem>
                  <SelectItem value="Ropa">Ropa</SelectItem>
                  <SelectItem value="Hogar">Hogar</SelectItem>
                  <SelectItem value="Alimentos y bebidas">Alimentos y bebidas</SelectItem>
                  <SelectItem value="Belleza y cuidado personal">Belleza y cuidado personal</SelectItem>
                  <SelectItem value="Cocina">Cocina</SelectItem>
                  <SelectItem value="Electronica">Electronica</SelectItem>
                  <SelectItem value="Herramienta">Herramienta</SelectItem>
                  <SelectItem value="Artesanal">Artesanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-color" className='mb-2'>Color</Label>
              <Input
                id="edit-color"
                value={formData.Color}
                onChange={(e) => handleInputChange('Color', e.target.value)}
                placeholder="Color del producto"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-brand" className='mb-2'>Marca</Label>
              <Input
                id="edit-brand"
                value={formData.ProductBrand}
                onChange={(e) => handleInputChange('ProductBrand', e.target.value)}
                placeholder="Marca del producto"
              />
            </div>
            <div>
              <Label htmlFor="edit-sku" className='mb-2'>SKU</Label>
              <Input
                id="edit-sku"
                value={formData.ProductSKU}
                onChange={(e) => handleInputChange('ProductSKU', e.target.value)}
                placeholder="SKU del producto"
              />
            </div>
          </div>

          {/* Nuevas dimensiones físicas */}
          <div>
            <Label className='mb-2 text-sm font-semibold'>Dimensiones físicas (opcional)</Label>
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div>
                <Label htmlFor="edit-height" className='mb-1 text-xs'>Alto (cm)</Label>
                <Input
                  id="edit-height"
                  type="number"
                  value={formData.ProductHeight || ''}
                  onChange={(e) => handleInputChange('ProductHeight', e.target.value || '')}
                  placeholder="0"
                  step="0.1"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-length" className='mb-1 text-xs'>Largo (cm)</Label>
                <Input
                  id="edit-length"
                  type="number"
                  value={formData.ProductLength || ''}
                  onChange={(e) => handleInputChange('ProductLength', e.target.value || '')}
                  placeholder="0"
                  step="0.1"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-width" className='mb-1 text-xs'>Ancho (cm)</Label>
                <Input
                  id="edit-width"
                  type="number"
                  value={formData.ProductWidth || ''}
                  onChange={(e) => handleInputChange('ProductWidth', e.target.value || '')}
                  placeholder="0"
                  step="0.1"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-weight" className='mb-1 text-xs'>Peso (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  value={formData.ProductWeight || ''}
                  onChange={(e) => handleInputChange('ProductWeight', e.target.value || '')}
                  placeholder="0"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
            {(formData.ProductHeight && formData.ProductLength && formData.ProductWidth) && (
              <div className="mt-2 text-xs text-gray-600">
                Volumen: {(Number(formData.ProductHeight) * Number(formData.ProductLength) * Number(formData.ProductWidth)).toLocaleString()} cm³
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="edit-image" className='mb-2'>URL de la imagen</Label>
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

      <SheetFooter className="h-[12hv]">
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
        
        {/* Dimensiones físicas */}
        {(ProductHeight || ProductLength || ProductWidth || ProductWeight) && (
          <>
            <Separator className='mt-2' />
            <div className='flex mt-3.5'>
              <div className='w-full'>Dimensiones</div>
              <div className='w-full text-right'>
                {ProductDimensions || `${ProductHeight || '?'} × ${ProductLength || '?'} × ${ProductWidth || '?'} cm`}
              </div>
            </div>
            {ProductWeight && (
              <div className='flex mt-3.5'>
                <div className='w-full'>Peso</div>
                <div className='w-full text-right'>{ProductWeightDisplay || `${ProductWeight} kg`}</div>
              </div>
            )}
            {ProductVolume && (
              <div className='flex mt-3.5'>
                <div className='w-full'>Volumen</div>
                <div className='w-full text-right'>{ProductVolume.toLocaleString()} cm³</div>
              </div>
            )}
          </>
        )}
        
        <Separator className='mt-2' />
        <div className='flex mt-3.5'>
          <div className='w-full'>SKU</div>
          <div className='w-full text-right'>{ProductSKU}</div>
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

  export const Orden = ({ OrderID, OrderInfo, NoProducts, OrderStatus, OrderTotal, OrderDate, PaymentMethod, ClientName, Email, PhoneNumber, PackageStatus }: OrdenComponent) => {

    return (
      <TableRow key={OrderID}>
        <TableCell className="flex">#{OrderID}</TableCell>
        <TableCell className="max-w-32 break-words whitespace-normal">{OrderInfo.map((item) => (item.ProductName))}</TableCell>
        <TableCell>{NoProducts}</TableCell>
        <TableCell>
          <p className={`w-max rounded-lg px-[6px] ${getStatusBadgeClass(OrderStatus)}`}>
            {OrderStatus === 1 ? 'Completado' : OrderStatus === 2 ? 'Pendiente' : OrderStatus === 3 ? 'Cancelado' : 'Desconocido'}
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
                    <p className={`w-max rounded-lg px-[6px] ${getStatusBadgeClass(OrderStatus)}`}>
                      {OrderStatus === 1 ? 'Completado' : OrderStatus === 2 ? 'Pendiente' : OrderStatus === 3 ? 'Cancelado' : 'Desconocido'}
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

