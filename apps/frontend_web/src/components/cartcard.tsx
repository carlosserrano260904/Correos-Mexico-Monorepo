import React from 'react'
import { CartProductItem } from '@/components/cartProductItem'
import { CartItemProps } from '@/stores/useCartStore'
import { Separator } from './ui/separator'

export const CartCard = ({ className, cartItems }: { className: string, cartItems: CartItemProps[] }) => {
  return (
    <div className={`w-full h-fit bg-[#F7F7F7] p-5 rounded-2xl ${className}`}>
      {cartItems.map((item, idx) => (
        <div key={item.ProductID}>
          <CartProductItem
            ProductID={item.ProductID}
            ProductImageUrl={item.ProductImageUrl}
            ProductName={item.ProductName}
            productPrice={item.productPrice}
            prodcutQuantity={item.prodcutQuantity}
            isSelected={item.isSelected}
          />
          {idx < cartItems.length - 1 && <Separator/>}
        </div>
      ))}
    </div>
  )
}