"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import React from "react"
import { ProductosProps } from "@/types/index"

interface ProductSheetProps {
  product: ProductosProps
  children?: React.ReactNode
  asTableRow?: boolean
}

export const ProductSheet = ({ product, children, asTableRow = false }: ProductSheetProps) => {
  if (!product) return null

  if (asTableRow) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <tr
            className="group relative cursor-pointer hover:bg-muted/50"
            style={{ userSelect: "none" }}
          >
            <td className="p-3 flex items-center gap-4">
              {product.ProductImageUrl && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={product.ProductImageUrl}
                    alt={product.ProductName}
                    className="rounded-md object-cover w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-medium truncate">{product.ProductName}</h4>
                <p className="text-sm text-muted-foreground truncate">{product.ProductCategory}</p>
              </div>
            </td>

            <td>{product.ProductBrand || "-"}</td>
            <td>{product.ProductStatus ? "Activo" : "Inactivo"}</td>
            <td>{product.ProductStock ?? "-"}</td>
            <td>{product.ProductSellerName || "-"}</td>
            <td>{product.ProductSold ?? "-"}</td>

            <td className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              </div>
            </td>
          </tr>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader className="mb-6">
            <SheetTitle>{product.ProductName}</SheetTitle>
            <SheetDescription>Detalles completos del producto</SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {product.ProductImageUrl && (
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={product.ProductImageUrl}
                  alt={product.ProductName}
                  className="object-cover w-full h-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}

            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <p className="font-medium">{product.ProductStatus ? "Activo" : "Inactivo"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Inventario</p>
                  <p className="font-medium">{product.ProductStock ?? "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Categoría</p>
                  <p className="font-medium">{product.ProductCategory}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vendedor</p>
                  <p className="font-medium">{product.ProductSellerName}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground">Productos vendidos</p>
                <p className="font-medium">{product.ProductSold ?? "-"}</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className="group relative cursor-pointer hover:bg-muted/50 rounded-md border"
          style={{ userSelect: "none" }}
        >
          {children || (
            <div className="flex items-center gap-4 p-3">
              {product.ProductImageUrl && (
                <div className="relative w-16 h-16">
                  <img
                    src={product.ProductImageUrl}
                    alt={product.ProductName}
                    className="rounded-md object-cover w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{product.ProductName}</h4>
                <p className="text-sm text-muted-foreground truncate">{product.ProductCategory}</p>
              </div>
            </div>
          )}

          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="mb-6">
          <SheetTitle>{product.ProductName}</SheetTitle>
          <SheetDescription>Detalles completos del producto</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {product.ProductImageUrl && (
            <div className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={product.ProductImageUrl}
                alt={product.ProductName}
                className="object-cover w-full h-full"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          <div className="grid gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Estado</p>
                <p className="font-medium">{product.ProductStatus ? "Activo" : "Inactivo"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Inventario</p>
                <p className="font-medium">{product.ProductStock ?? "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Categoría</p>
                <p className="font-medium">{product.ProductCategory}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vendedor</p>
                <p className="font-medium">{product.ProductSellerName}</p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground">Productos vendidos</p>
              <p className="font-medium">{product.ProductSold ?? "-"}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
