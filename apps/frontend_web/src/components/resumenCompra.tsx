'use client'
import React, { useState, useEffect } from 'react'
import { Separator } from './ui/separator'
import { useCart } from '@/hooks/useCart'
import { useCupons } from '@/hooks/useCupons'
import { useProducts } from '@/hooks/useProduct'
import { CuponProps } from '@/types/interface'
import Link from 'next/link'

export const ResumenCompra = ({ className }: { className: string }) => {
  const { 
    getSelectedItems, 
    getSubtotal, 
    getTotal, 
    ShippingCost,
    setShippingCost,
    AppliedCupons,
    applyCupon,
    removeCupon
  } = useCart();

  const { Cupons } = useCupons();
  const { getProduct } = useProducts();

  // Estado para evitar hydratación
  const [isMounted, setIsMounted] = useState(false);
  const [showCuponSelector, setShowCuponSelector] = useState(false);

  // Marcar como montado solo en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Solo obtener datos después del montaje
  const selectedItems = isMounted ? getSelectedItems() : [];

  // Establecer costo de envío solo después del montaje
  useEffect(() => {
    if (isMounted && ShippingCost === 0 && selectedItems.length > 0) {
      setShippingCost(99);
    }
  }, [isMounted, ShippingCost, selectedItems.length, setShippingCost]);

  // Verificar si un cupón está activo y vigente
  const isCuponValid = (cupon: CuponProps) => {
    const today = new Date();
    const endDate = new Date(cupon.EndDate);
    return cupon.CuponStatus === 1 && endDate >= today;
  };

  // Obtener cupones válidos para los productos seleccionados
  const getValidCupons = () => {
    if (!isMounted || selectedItems.length === 0) return [];
    
    const validCuponIds = new Set<number>();
    
    // Verificar desde los productos (ProductCupons)
    selectedItems.forEach(cartItem => {
      const fullProduct = getProduct(cartItem.ProductID);
      if (fullProduct && fullProduct.ProductCupons) {
        fullProduct.ProductCupons.forEach(cuponId => {
          validCuponIds.add(cuponId);
        });
      }
    });
    
    // También verificar desde los cupones (CuponProductsId)
    Cupons.forEach(cupon => {
      if (cupon.CuponProductsId && cupon.CuponProductsId.length > 0) {
        const hasValidProduct = selectedItems.some(cartItem => 
          cupon.CuponProductsId.includes(cartItem.ProductID)
        );
        if (hasValidProduct) {
          validCuponIds.add(cupon.CuponID);
        }
      }
    });
    
    // Filtrar cupones válidos, activos, no expirados y no aplicados
    return Cupons.filter(cupon => 
      validCuponIds.has(cupon.CuponID) && 
      !AppliedCupons.includes(cupon.CuponID) &&
      isCuponValid(cupon)
    );
  };

  const validCupons = getValidCupons();

  const handleApplyCupon = (cuponId: number) => {
    applyCupon(cuponId);
    setShowCuponSelector(false);
  };

  const handleRemoveCupon = (cuponId: number) => {
    removeCupon(cuponId);
  };

  const getAppliedCuponNames = () => {
    return AppliedCupons.map(cuponId => {
      const cupon = Cupons.find(c => c.CuponID === cuponId);
      return cupon ? cupon.CuponCode : `Cupón ${cuponId}`;
    });
  };

  // Calcular descuento total de cupones aplicados
  const calculateCuponDiscount = () => {
    if (!isMounted || AppliedCupons.length === 0) return 0;
    
    return AppliedCupons.reduce((totalDiscount, cuponId) => {
      const cupon = Cupons.find(c => c.CuponID === cuponId);
      if (!cupon) return totalDiscount;
      
      // Verificar si el cupón es aplicable a productos seleccionados
      const applicableItems = selectedItems.filter(item => {
        const fullProduct = getProduct(item.ProductID);
        return fullProduct && (
          fullProduct.ProductCupons.includes(cuponId) ||
          cupon.CuponProductsId.includes(item.ProductID)
        );
      });
      
      if (applicableItems.length === 0) return totalDiscount;
      
      // Calcular subtotal de productos aplicables
      const applicableSubtotal = applicableItems.reduce((sum, item) => 
        sum + (item.productPrice * item.prodcutQuantity), 0
      );
      
      // Aplicar descuento porcentual
      const discount = (applicableSubtotal * cupon.Discount) / 100;
      return totalDiscount + discount;
    }, 0);
  };

  // Cálculos con descuentos aplicados
  const rawSubtotal = isMounted ? getSubtotal() : 0;
  const cuponDiscount = calculateCuponDiscount();
  const finalSubtotal = rawSubtotal - cuponDiscount;
  const finalTotal = finalSubtotal + (ShippingCost || 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleContinueCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Selecciona al menos un producto para continuar');
      return;
    }
    console.log('Proceder al checkout con:', selectedItems);
  };

  // Mostrar loading durante hidratación
  if (!isMounted) {
    return (
      <div className={`w-full bg-[#F7F7F7] p-5 rounded-2xl ${className}`}>
        <div className='font-semibold text-lg'>
          Resumen de compras
        </div>
        <Separator className='mt-2'/>
        <div className='text-center py-8 text-gray-500'>
          Cargando resumen...
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-[#F7F7F7] p-5 rounded-2xl ${className}`}>
      <div className='font-semibold text-lg'>
        Resumen de compras
      </div>
      <Separator className='mt-2'/>
      
      <div className='flex-col gap-2 mt-4'>
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <div key={item.ProductID} className='flex mx-4 mb-2'>
              <div className='text-start basis-3/5 text-sm'>
                <span>{item.ProductName}</span>
                <span className='text-gray-500 ml-1'>x{item.prodcutQuantity}</span>
              </div>
              <div className='text-end basis-2/5 text-sm'>
                {formatPrice(item.productPrice * item.prodcutQuantity)}
              </div>
            </div>
          ))
        ) : (
          <div className='flex mx-4 mb-2'>
            <div className='text-start basis-1/2 text-gray-500 text-sm'>
              No hay productos seleccionados
            </div>
          </div>
        )}
        
        <Separator className='my-2'/>
        
        <div className='flex mx-4 mb-1'>
          <div className='text-start basis-1/2 text-sm'>Subtotal</div>
          <div className='text-end basis-1/2 text-sm'>{formatPrice(rawSubtotal)}</div>
        </div>

        {cuponDiscount > 0 && (
          <div className='flex mx-4 mb-1'>
            <div className='text-start basis-1/2 text-sm text-green-600'>Descuento cupones</div>
            <div className='text-end basis-1/2 text-sm text-green-600'>-{formatPrice(cuponDiscount)}</div>
          </div>
        )}
        
        <div className='flex mx-4'>
          <div className='text-start basis-1/2 text-sm'>Envío</div>
          <div className='text-end basis-1/2 text-sm'>
            {selectedItems.length > 0 ? formatPrice(ShippingCost || 0) : '$0.00'}
          </div>
        </div>
        
        {AppliedCupons.length > 0 && (
          <div className='mx-4 mb-2'>
            <div className='text-sm text-green-600 mb-1'>Cupones aplicados:</div>
            {getAppliedCuponNames().map((cuponName, index) => (
              <div key={AppliedCupons[index]} className='flex justify-between items-center text-sm text-green-600 mb-1'>
                <span>• {cuponName}</span>
                <button 
                  onClick={() => handleRemoveCupon(AppliedCupons[index])}
                  className='text-red-500 hover:text-red-700 ml-2'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className='flex items-start justify-start'>
        <button 
          onClick={() => setShowCuponSelector(!showCuponSelector)}
          disabled={!isMounted || selectedItems.length === 0 || validCupons.length === 0}
          className='bg-transparent text-[#DE1484] ms-4 mt-6 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {validCupons.length > 0 ? 'Añadir cupón' : 'No hay cupones disponibles'}
        </button>
      </div>

      {/* Selector de cupones */}
      {isMounted && showCuponSelector && validCupons.length > 0 && (
        <div className='mx-4 mt-3 p-3 border border-gray-300 rounded-lg bg-white'>
          <div className='text-sm font-semibold mb-2'>Cupones disponibles:</div>
          {validCupons.map((cupon) => (
            <div key={cupon.CuponID} className='flex justify-between items-center py-2 border-b last:border-b-0'>
              <div className='flex-1'>
                <div className='text-sm font-medium'>{cupon.CuponCode}</div>
                <div className='text-xs text-green-600'>
                  {cupon.Discount}% OFF
                </div>
                <div className='text-xs text-gray-500'>
                  Válido hasta: {new Date(cupon.EndDate).toLocaleDateString('es-MX')}
                </div>
              </div>
              <button
                onClick={() => handleApplyCupon(cupon.CuponID)}
                className='ml-3 px-3 py-1 bg-[#DE1484] text-white text-xs rounded hover:bg-[#c41374] transition-colors'
              >
                Aplicar
              </button>
            </div>
          ))}
        </div>
      )}
      
      <Separator className='mt-4'/>
      
      <div className='flex mx-4 mt-3'>
        <div className='text-start basis-1/2 font-semibold'>Total</div>
        <div className='text-end basis-1/2 font-semibold text-lg'>
          {formatPrice(finalTotal)}
        </div>
      </div>
      
      <div className='w-full mt-4'>
        <Link href={'/pago/'}>
        <button 
          onClick={handleContinueCheckout}
          disabled={selectedItems.length === 0}
          className='rounded-3xl bg-[#DE1484] text-white font-semibold w-full px-3 py-2 hover:bg-[#c41374] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Continuar Compra ({selectedItems.length} productos)
        </button></Link>
      </div>
    </div>
  )
}