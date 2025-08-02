import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table"
import { ProductosProps } from "../../../../../types/interface"
import { Producto } from "../../../components/primitivos";
import { Separator } from "../../../../../components/ui/separator";

interface Data {
  entradas: ProductosProps[],
  variants?: 'full' | 'compact'
}

export default function TableDemo({ entradas, variants = 'full' }: Data) {

  switch (variants) {
    case 'full':
      return (
        <div className="max-h-[620px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventario</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Vendedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entradas.map((entrada) => (
                <Producto
                  key={entrada.ProductID}
                  ProductBrand={entrada.ProductBrand}
                  ProductCategory={entrada.ProductCategory}
                  ProductID={entrada.ProductID}
                  ProductImageUrl={entrada.ProductImageUrl}
                  ProductName={entrada.ProductName}
                  ProductSellerName={entrada.ProductSellerName}
                  ProductStatus={entrada.ProductStatus}
                  ProductStock={entrada.ProductStock}
                  ProductSold={entrada.ProductSold}
                  ProductSlug={entrada.ProductSlug}
                  ProductDescription={entrada.ProductDescription}
                  productPrice={entrada.productPrice}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      );
      break;

    case 'compact':
      return (
        <div className='bg-white max-h-[270px] overflow-y-auto rounded-xl border'>
          {entradas.map((entrada, idx) => (
            <div className="px-6" key={idx}>
              <Producto
                key={entrada.ProductID}
                ProductBrand={entrada.ProductBrand}
                ProductCategory={entrada.ProductCategory}
                ProductID={entrada.ProductID}
                ProductImageUrl={entrada.ProductImageUrl}
                ProductName={entrada.ProductName}
                ProductSellerName={entrada.ProductSellerName}
                ProductStatus={entrada.ProductStatus}
                ProductStock={entrada.ProductStock}
                variant={variants}
                ProductSold={entrada.ProductSold}
                ProductSlug={entrada.ProductSlug}
                ProductDescription={entrada.ProductDescription}
                productPrice={entrada.productPrice}
              />
              {idx < entradas.length - 1 && <Separator/>}
            </div>
          ))}
        </div>
      );
      break
  }

}