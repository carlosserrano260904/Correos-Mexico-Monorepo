import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CuponProps } from "@/types/interface"
import { Separator } from "@/components/ui/separator"
import { CouponSheet } from "./CouponSheet" // Ajusta ruta según tu estructura
import { Cupon } from "@/app/Vendedor/components/primitivos"

interface TableroCuponesProps {
  entradas: CuponProps[]
  variant?: "full" | "compact"
}

const mapStatusNumberToString = (statusNum: number): "Activo" | "Borrador" | "Caducado" => {
  switch (statusNum) {
    case 1:
      return "Activo"
    case 2:
      return "Borrador"
    case 3:
      return "Caducado"
    default:
      return "Caducado"
  }
}

export default function TableroCupones({ entradas, variant = "full" }: TableroCuponesProps) {
  if (variant === "full") {
    return (
      <div className="max-h-[620px] overflow-y-auto bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cupón</TableHead>
              <TableHead>Veces Usado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fecha de Expiración</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entradas.map((entrada) => (
              <Cupon
                key={entrada.CuponID}
                variant="full"
                CuponID={entrada.CuponID}
                CuponStatus={entrada.CuponStatus}
                CuponCode={entrada.CuponCode}
                TimesUsed={entrada.TimesUsed}
                EndDate={entrada.EndDate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Compacto
  return (
    <div className='bg-white max-h-[270px] overflow-y-auto rounded-xl border'>
      {entradas.map((entrada, idx) => (
        <div className="px-6 w-full mt-3" key={idx}>
           <Cupon 
             key={entrada.CuponID}
             CuponCode={entrada.CuponCode}
             CuponID={entrada.CuponID}
             CuponStatus={entrada.CuponStatus}
             EndDate={entrada.EndDate}
             TimesUsed={entrada.TimesUsed}
             variant={variant}
            />
            {idx < entradas.length - 1 && <Separator/>}
        </div>
      ))}
    </div>
  )
}
