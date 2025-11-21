"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import React from "react"

interface Discount {
  name: string
  timesUsed: number
  status: "Activo" | "Borrador" | "Caducado"
  createdAt: string
  expiresAt: string
}

interface DiscountSheetProps {
  discount?: Discount
  asTableRow?: boolean
  children?: React.ReactNode
}

export function DiscountSheet({ discount, asTableRow = false, children }: DiscountSheetProps) {
  if (!discount) return null

  const renderSheetContent = () => (
    <SheetContent side="right" className="w-full sm:max-w-md pt-6 pb-8 px-0">
      <div className="px-6">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-lg font-semibold">{discount.name}</SheetTitle>
          <SheetDescription>Detalles del descuento</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Veces usado</span>
            <span className="text-foreground">{discount.timesUsed}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Estatus</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                discount.status === "Activo"
                  ? "bg-green-100 text-green-600"
                  : discount.status === "Borrador"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {discount.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Fecha de creación</span>
            <span className="text-foreground">{discount.createdAt}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Fecha de expiración</span>
            <span className="text-foreground">{discount.expiresAt}</span>
          </div>
        </div>
      </div>
    </SheetContent>
  )

  if (asTableRow) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        {renderSheetContent()}
      </Sheet>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Ver detalles
        </Button>
      </SheetTrigger>
      {renderSheetContent()}
    </Sheet>
  )
}
