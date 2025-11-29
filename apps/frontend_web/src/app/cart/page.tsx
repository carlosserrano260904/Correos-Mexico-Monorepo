// app/cart/page.tsx
import React from 'react';
import { CartPage } from '@/components/CartPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito de Compras - Tu E-commerce',
  description: 'Revisa y gestiona los productos en tu carrito de compras',
};

export default function Cart() {
  return <CartPage />;
}