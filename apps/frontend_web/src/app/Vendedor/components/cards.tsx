
'use client';

import {CardsResumen} from "../../../types/interface"
import {  Card_cambio, Card_titulo, Card_valor } from "./primitivos";
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React from 'react';
import { cn } from "../../lib/utils";


type CardResumenProps = {
  icon: React.ElementType;
  titulo: string;
  valor: number | string;
  cambio: number;
  onClick: () => void;
};
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardResumen({
  icon: Icon,
  titulo,
  valor,
  cambio,
  onClick,
}: CardResumenProps) {
  const isPositive = cambio >= 0;

  return (
    
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white p-5 rounded-xl border flex flex-col gap-3 hover:shadow transition"
        
      }`}
    >
    

      {/* Título + Cambio en la esquina superior derecha */}
      <div className="flex justify-between items-start">
        {/* Icono + Título */}
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <Card_titulo titulo={titulo} />
        </div>

        {/* Badge con el porcentaje */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(cambio).toFixed(1)}%
        </div>
      </div>

      {/* Valor principal grande */}
      <Card_valor valor={valor} />

    </div>
  );
}
