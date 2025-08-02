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

interface Coupon {
  code: string
  timesUsed: number
  status: "Activo" | "Borrador" | "Caducado"
  createdAt: string
  expiresAt: string
}

interface CouponSheetProps {
  coupon?: Coupon
  asTableRow?: boolean
  children?: React.ReactNode
}

export function CouponSheet({ coupon, asTableRow = false, children }: CouponSheetProps) {
  if (!coupon) return null

  const renderSheetContent = () => (
    <SheetContent side="right" className="w-full sm:max-w-md pt-6 pb-8 px-0">
      <div className="px-6">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-lg font-semibold">{coupon.code}</SheetTitle>
          <SheetDescription>Detalles del cupón</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Veces usado</span>
            <span className="text-foreground">{coupon.timesUsed}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Estatus</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                coupon.status === "Activo"
                  ? "bg-green-100 text-green-600"
                  : coupon.status === "Borrador"
                  ? "bg-orange-100 text-orange-500"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {coupon.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Fecha de creación</span>
            <span className="text-foreground">{coupon.createdAt}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Fecha de expiración</span>
            <span className="text-foreground">{coupon.expiresAt}</span>
          </div>
        </div>
      </div>
    </SheetContent>
  )

  if (asTableRow) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <tr className="group cursor-pointer hover:bg-muted/50" style={{ userSelect: "none" }}>
            <td className="px-4 py-2">{coupon.code}</td>
            <td className="px-4 py-2">{coupon.timesUsed}</td>
            <td className="px-4 py-2">
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  coupon.status === "Activo"
                    ? "bg-green-100 text-green-600"
                    : coupon.status === "Borrador"
                    ? "bg-orange-100 text-orange-500"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {coupon.status}
              </span>
            </td>
            <td className="px-4 py-2">{coupon.expiresAt}</td>

            <td className="relative px-4 py-2">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Ver detalles del cupón"
                  >
                    Detalles
                  </Button>
                </SheetTrigger>
              </div>
            </td>
          </tr>
        </SheetTrigger>

        {renderSheetContent()}
      </Sheet>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center justify-between group hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          <div className="flex-1">{children}</div>

          <SheetTrigger asChild>
            <button
              className="text-blue-600 text-sm hover:underline ml-3 group-hover:text-blue-700"
              onClick={(e) => e.stopPropagation()}
              aria-label="Ver detalles del cupón"
            >
              Ver detalles
            </button>
          </SheetTrigger>
        </div>
      </SheetTrigger>

      {renderSheetContent()}
    </Sheet>
  )
}
