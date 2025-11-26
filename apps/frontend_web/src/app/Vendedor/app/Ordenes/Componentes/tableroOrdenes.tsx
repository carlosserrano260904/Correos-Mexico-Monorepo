import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {OrdenesProps} from "../../../../../types/interface"
import { Orden } from "@/app/Vendedor/components/primitivos";
import { Sheet, SheetTrigger } from "../../../../../components/ui/sheet";
import { FaInfo } from "react-icons/fa6";

interface Data {entradas: OrdenesProps[]}

export default function TableroOrdenes({entradas}: Data) {
  
  return (
    <div className="max-h-[620px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID de Orden</TableHead>
            <TableHead>Informacion de Producto</TableHead>
            <TableHead>No. de Productos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {entradas.map((entrada) => (
                  <Orden 
                    key={entrada.OrderID}
                    NoProducts={entrada.NoProducts}
                    OrderDate={entrada.OrderDate}
                    OrderID={entrada.OrderID}
                    OrderInfo={entrada.OrderInfo}
                    OrderStatus={entrada.OrderStatus}
                    OrderTotal={entrada.OrderTotal}
                    PaymentMethod={entrada.PaymentMethod}
                    ClientName={entrada.ClientName}
                    Email={entrada.Email}
                    PhoneNumber={entrada.PhoneNumber}
                    PackageStatus={entrada.PackageStatus}
                    />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

