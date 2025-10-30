'use client'
import { Grafico } from "@/app/Vendedor/components/grafico";
import { Plantilla } from "@/app/Vendedor/components/plantilla";
import { Title } from "@/app/Vendedor/components/primitivos";
import { Separator } from "@/components/ui/separator";
import TableroCupones from "./Cupones/Componentes/tableroCupones";
import TableDemo from "@/app/Vendedor/app/Productos/Componentes/tableroProductos";
import { useCupons } from "@/hooks/useCupons";
import { useProducts } from "@/hooks/useProduct";

export default function Home() {
  const {Products} = useProducts()
  const {Cupons} = useCupons()
  return (
    <div >
      <Plantilla title="Resumen">
        <Separator className="my-2"/>
        <Grafico/>
        <div className="flex justify-between gap-3 mt-5 text-[#374151]">
          <div className="flex-col justify-center w-full bg-[#F3F4F6] rounded-xl max-h-80 pt-3 mb-auto">
              <Title size="sm" className="ms-6 text-[#374151]">Uso de cupones</Title>
              <TableroCupones entradas={Cupons} variant="compact"/>
            </div>
          <div className="flex-col justify-center w-full bg-[#F3F4F6] rounded-xl max-h-80 pt-3 mb-auto">
              <Title size="sm" className="ms-6 text-[#374151]">Top productos del mes</Title>
              <TableDemo entradas={Products} variants="compact"/>
          </div>
        </div>
      </Plantilla>
    </div>
  );
}
