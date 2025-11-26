'use client';

import React, { JSX, ReactNode } from 'react';
{/* import { ListaCupones } from '../../app/Cupones/Componentes/ListaCupones'; */}


type CardWrapperProps = {
  title: string;
  children: ReactNode;
};

const CardWrapper = ({ title, children }: CardWrapperProps): JSX.Element => {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm h-[300px] flex flex-col">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="overflow-y-auto flex-1 pr-1">{children}</div>
    </div>
  );
};

type ResumenCardsWrapperProps = {
  cuponesContent: ReactNode;
  productosContent: ReactNode;
};

export const ResumenCardsWrapper = ({
  cuponesContent,
  productosContent,
}: ResumenCardsWrapperProps): JSX.Element => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <CardWrapper title="Uso de cupones">{cuponesContent}</CardWrapper>
      <CardWrapper title="Top productos del mes">{productosContent}</CardWrapper>
    </div>
  );
};
