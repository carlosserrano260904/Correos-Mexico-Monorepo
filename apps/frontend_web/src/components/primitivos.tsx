// Por alguna razon necesita el useClient
'use client'
import React from 'react'
import { ColetcionCardProps, ProductCardProps } from '@/types'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { IoBagOutline, IoHeartOutline, IoHeartSharp, IoBag } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProduct';
import { useCartWithBackend } from '@/hooks/useCartWithBackend';
import { useAuth } from '@/hooks/useAuth';

export const Btn = ({children, className, link}: {children: React.ReactNode, className:string, link?:string}) => {
  if (link) {
    return(
       <Link href={link} className={`p-2 rounded-full bg-[#F3F4F6] min-h-[51px] min-w-[54px] flex place-items-center justify-center ${className}`}>{children}</Link>
    )
  }
    return(
        <button className={`p-2 rounded-full bg-[#F3F4F6] min-h-[51px] min-w-[54px] flex place-items-center justify-center ${className}`}>{children}</button>
    )
}

export const ProductCard = ({ ProductID, ProductImage, ProductColors, ProductName, ProductPrice, onClick }: ProductCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { profile } = useAuth();
  const cart = useCartWithBackend(profile?.id || null);
  const { getProduct } = useProducts();
  
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(ProductPrice);
  
  const isProductFavorite = isFavorite(ProductID);
  const isInCart = cart.hasItem(ProductID);
  
  const Colors: string[] = ProductColors.filter(function(color){
    return color.includes('#')
  })

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(ProductID);
    } else {
      // Obtener el producto completo del store de productos
      const fullProduct = getProduct(ProductID);
      if (fullProduct) {
        addToFavorites(fullProduct);
      }
    }
  };

  const handleToggleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart) {
      await cart.removeFromCart(ProductID);
    } else {
      // Obtener el producto completo del store de productos
      const fullProduct = getProduct(ProductID);
      if (fullProduct) {
        await cart.addToCart(fullProduct, 1); // Agregar con cantidad 1
      }
    }
  };
 
  return (
    <Card className="max-w-1/4 mr-4 min-w-1/4 h-max-[300px] mb-1.5">
      <Link href={`/Producto/${ProductID}`} onClick={onClick}>
        <CardContent>
          <div className='h-[250px] w-full flex justify-center items-center overflow-hidden'>
            <img src={ProductImage} />
          </div>
          <div className="flex gap-2 my-2 justify-between">
            <div className='flex'>
              {Colors.map(color => <div key={color} className='h-3 w-3 rounded-full mr-1' style={{backgroundColor: color}}></div>)}
            </div>
            <div className='flex justify-between w-12'>
              <button onClick={handleToggleFavorite}>
                {isProductFavorite ? 
                  <IoHeartSharp className="w-5 h-5 text-red-600" /> : 
                  <IoHeartOutline className="w-5 h-5"/>
                }
              </button>
              <button onClick={handleToggleCart}>
                {isInCart ? 
                  <IoBag className="w-5 h-5 text-[#DE1484]" /> : 
                  <IoBagOutline className="w-5 h-5"/>
                }
              </button>
            </div>
          </div>
         
          <div className="truncate overflow-hidden whitespace-nowrap text-sm my-2">
            {ProductName}
          </div>
          <CardTitle>
              {formattedPrice} MXN {/* Editable para aceptar varias divisas */}
          </CardTitle>
        </CardContent>
      </Link>
    </Card>
  )
}

export const ColectionCard = ({ ProductImage, ProductName, onClick}: ColetcionCardProps) => {
  return (
    <Card className="max-w-1/4 mr-4 min-w-1/4 h-max-[300px] mb-1.5">
      <div>
        <CardContent>
          <div className='text-pretty'>
            {ProductName}
            <div className='h-[250px] w-full flex justify-center items-center overflow-hidden'>
               <img src={ProductImage} />
            </div>
          </div>
          <div className='flex text-sm'>
            <Link href={'/Producto/'} onClick={onClick} className='flex place-items-center w-full'>Descubre mas <FaAngleRight /></Link>
            <Link href={'/Carrito'} className='flex place-items-center justify-end w-full text-nowrap'>Agregar al carrito <FaAngleRight /></Link>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export const Title = ({ children }: { children: string }) => {
  return (
    <span className=" text-[20px] mt-2 block w-[184px] text-center break-words whitespace-normal">{children}</span>
  );
};