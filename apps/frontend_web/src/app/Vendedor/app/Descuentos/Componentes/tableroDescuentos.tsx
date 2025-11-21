import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table"
import { DescuentoProps } from "../../../../../types/interface"
import { Separator } from "../../../../../components/ui/separator"
import { DiscountSheet } from "./DiscountSheet"
import { Descuento } from "../../../components/primitivos"

interface TablerDescuentosProps {
  entradas: DescuentoProps[]
  variant?: "full" | "compact"
}

export default function TablerDescuentos({ entradas, variant = "full" }: TablerDescuentosProps) {
  if (variant === "full") {
    return (
      <div className="max-h-[620px] overflow-y-auto bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descuento</TableHead>
              <TableHead>Veces Usado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fecha de Expiración</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entradas.map((entrada) => (
              <Descuento
                key={entrada.DescuentoID}
                variant="full"
                DescuentoID={entrada.DescuentoID}
                DescuentoName={entrada.DescuentoName}
                TimesUsed={entrada.TimesUsed}
                DescuentoStatus={entrada.DescuentoStatus}
                EndDate={entrada.EndDate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className="space-y-2">
        {entradas.slice(0, 5).map((entrada, index) => (
          <div key={entrada.DescuentoID}>
            <Descuento
              variant="compact"
              DescuentoID={entrada.DescuentoID}
              DescuentoName={entrada.DescuentoName}
              TimesUsed={entrada.TimesUsed}
              DescuentoStatus={entrada.DescuentoStatus}
              EndDate={entrada.EndDate}
            />
            {index < Math.min(entradas.length, 5) - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return null
}
