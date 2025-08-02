"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { MdOutlineShoppingCart } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { PiMoneyWavyLight } from "react-icons/pi";
import { Card, CardContent, CardResumen } from "@/app/Vendedor/components/cards";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"


export const description = "An interactive bar chart"

interface  ChartData {
  date: string,
  comprasUltMes: number,
  usuarioNuevos: number,
  ingresos_mensuales: number
}

const chartData = [
  //fecha , desktop seria la primer seccion de compras en el mes, mobile es la segunda seccion de usuarios nuevos, ingresos mensuales pues como su nombre lo dice es de los ingresos jaja
  { date: "2024-04-01", comprasUltMes: 222, usuariosNuevos: 150, ingresos_mensuales: 100 },
  { date: "2024-04-02", comprasUltMes: 97, usuariosNuevos: 180, ingresos_mensuales: 400 },
  { date: "2024-04-03", comprasUltMes: 167, usuariosNuevos: 120, ingresos_mensuales: 128 },
  { date: "2024-04-04", comprasUltMes: 242, usuariosNuevos: 260, ingresos_mensuales: 354 },
  { date: "2024-04-05", comprasUltMes: 373, usuariosNuevos: 290, ingresos_mensuales: 541 },
  { date: "2024-04-06", comprasUltMes: 301, usuariosNuevos: 340, ingresos_mensuales: 365 },
  { date: "2024-04-07", comprasUltMes: 245, usuariosNuevos: 180, ingresos_mensuales: 248 }, //todo simetrico al final 
  { date: "2024-04-08", comprasUltMes: 409, usuariosNuevos: 320, ingresos_mensuales: 921 },
  { date: "2024-04-09", comprasUltMes: 59, usuariosNuevos: 110, ingresos_mensuales: 123 },
  { date: "2024-04-10", comprasUltMes: 261, usuariosNuevos: 190, ingresos_mensuales: 456 },
  { date: "2024-04-11", comprasUltMes: 327, usuariosNuevos: 350, ingresos_mensuales: 354 },
  { date: "2024-04-12", comprasUltMes: 292, usuariosNuevos: 210, ingresos_mensuales: 222 },
  { date: "2024-04-13", comprasUltMes: 342, usuariosNuevos: 380, ingresos_mensuales: 578 },
  { date: "2024-04-14", comprasUltMes: 137, usuariosNuevos: 220, ingresos_mensuales: 578 },
  { date: "2024-04-15", comprasUltMes: 120, usuariosNuevos: 170, ingresos_mensuales: 563 },
  { date: "2024-04-16", comprasUltMes: 138, usuariosNuevos: 190, ingresos_mensuales: 137 },
  { date: "2024-04-17", comprasUltMes: 446, usuariosNuevos: 360, ingresos_mensuales: 465 },
  { date: "2024-04-18", comprasUltMes: 364, usuariosNuevos: 410, ingresos_mensuales: 952 },
  { date: "2024-04-19", comprasUltMes: 243, usuariosNuevos: 180, ingresos_mensuales: 489 },
  { date: "2024-04-20", comprasUltMes: 89, usuariosNuevos: 150, ingresos_mensuales: 541 },
  { date: "2024-04-21", comprasUltMes: 137, usuariosNuevos: 200, ingresos_mensuales: 541 },
  { date: "2024-04-22", comprasUltMes: 224, usuariosNuevos: 170, ingresos_mensuales: 541 },
  { date: "2024-04-23", comprasUltMes: 138, usuariosNuevos: 230, ingresos_mensuales: 132 },
  { date: "2024-04-24", comprasUltMes: 387, usuariosNuevos: 290, ingresos_mensuales: 444 },
  { date: "2024-04-25", comprasUltMes: 215, usuariosNuevos: 250, ingresos_mensuales: 541 },
  { date: "2024-04-26", comprasUltMes: 75, usuariosNuevos: 130, ingresos_mensuales: 12 },
  { date: "2024-04-27", comprasUltMes: 383, usuariosNuevos: 420, ingresos_mensuales: 762 },
  { date: "2024-04-28", comprasUltMes: 122, usuariosNuevos: 180, ingresos_mensuales: 556 },
  { date: "2024-04-29", comprasUltMes: 315, usuariosNuevos: 240, ingresos_mensuales: 300 },
  { date: "2024-04-30", comprasUltMes: 454, usuariosNuevos: 380, ingresos_mensuales: 140 },
  { date: "2024-05-01", comprasUltMes: 165, usuariosNuevos: 220, ingresos_mensuales: 130 },
  { date: "2024-05-02", comprasUltMes: 293, usuariosNuevos: 310, ingresos_mensuales: 140 },
  { date: "2024-05-03", comprasUltMes: 247, usuariosNuevos: 190, ingresos_mensuales: 265 },
  { date: "2024-05-04", comprasUltMes: 385, usuariosNuevos: 420, ingresos_mensuales: 462 },
  { date: "2024-05-05", comprasUltMes: 481, usuariosNuevos: 390, ingresos_mensuales: 306 },
  { date: "2024-05-06", comprasUltMes: 498, usuariosNuevos: 520, ingresos_mensuales: 950 },
  { date: "2024-05-07", comprasUltMes: 388, usuariosNuevos: 300, ingresos_mensuales: 140 },
  { date: "2024-05-08", comprasUltMes: 149, usuariosNuevos: 210, ingresos_mensuales: 166 },
  { date: "2024-05-09", comprasUltMes: 227, usuariosNuevos: 180, ingresos_mensuales: 423 },
  { date: "2024-05-10", comprasUltMes: 293, usuariosNuevos: 330, ingresos_mensuales: 142 },
  { date: "2024-05-11", comprasUltMes: 335, usuariosNuevos: 270, ingresos_mensuales: 703 },
  { date: "2024-05-12", comprasUltMes: 197, usuariosNuevos: 240, ingresos_mensuales: 503 },
  { date: "2024-05-13", comprasUltMes: 197, usuariosNuevos: 160, ingresos_mensuales: 151 },
  { date: "2024-05-14", comprasUltMes: 448, usuariosNuevos: 490, ingresos_mensuales: 240 },
  { date: "2024-05-15", comprasUltMes: 473, usuariosNuevos: 380, ingresos_mensuales: 400 },
  { date: "2024-05-16", comprasUltMes: 338, usuariosNuevos: 400, ingresos_mensuales: 338 },
  { date: "2024-05-17", comprasUltMes: 499, usuariosNuevos: 420, ingresos_mensuales: 499 },
  { date: "2024-05-18", comprasUltMes: 315, usuariosNuevos: 350, ingresos_mensuales: 315 },
  { date: "2024-05-19", comprasUltMes: 235, usuariosNuevos: 180, ingresos_mensuales: 541 },
  { date: "2024-05-20", comprasUltMes: 177, usuariosNuevos: 230, ingresos_mensuales: 177 },
  { date: "2024-05-21", comprasUltMes: 82, usuariosNuevos: 140, ingresos_mensuales: 95 },
  { date: "2024-05-22", comprasUltMes: 81, usuariosNuevos: 120, ingresos_mensuales: 541 },
  { date: "2024-05-23", comprasUltMes: 252, usuariosNuevos: 290, ingresos_mensuales: 2 },
  { date: "2024-05-24", comprasUltMes: 294, usuariosNuevos: 220, ingresos_mensuales: 621 },
  { date: "2024-05-25", comprasUltMes: 201, usuariosNuevos: 250, ingresos_mensuales: 33 },
  { date: "2024-05-26", comprasUltMes: 213, usuariosNuevos: 170, ingresos_mensuales: 123 },
  { date: "2024-05-27", comprasUltMes: 420, usuariosNuevos: 460, ingresos_mensuales: 541 },
  { date: "2024-05-28", comprasUltMes: 233, usuariosNuevos: 190, ingresos_mensuales: 541 },
  { date: "2024-05-29", comprasUltMes: 78, usuariosNuevos: 130, ingresos_mensuales: 541 },
  { date: "2024-05-30", comprasUltMes: 340, usuariosNuevos: 280, ingresos_mensuales: 561 },
  { date: "2024-05-31", comprasUltMes: 178, usuariosNuevos: 230, ingresos_mensuales: 501 },
  { date: "2024-06-01", comprasUltMes: 178, usuariosNuevos: 200, ingresos_mensuales: 401 },
  { date: "2024-06-02", comprasUltMes: 470, usuariosNuevos: 410, ingresos_mensuales: 901 },
  { date: "2024-06-03", comprasUltMes: 103, usuariosNuevos: 160, ingresos_mensuales: 564 },
  { date: "2024-06-04", comprasUltMes: 439, usuariosNuevos: 380, ingresos_mensuales: 103 },
  { date: "2024-06-05", comprasUltMes: 88, usuariosNuevos: 140, ingresos_mensuales: 320 },
  { date: "2024-06-06", comprasUltMes: 294, usuariosNuevos: 250, ingresos_mensuales: 541 },
  { date: "2024-06-07", comprasUltMes: 323, usuariosNuevos: 370, ingresos_mensuales: 541 },
  { date: "2024-06-08", comprasUltMes: 385, usuariosNuevos: 320, ingresos_mensuales: 522 },
  { date: "2024-06-09", comprasUltMes: 438, usuariosNuevos: 480, ingresos_mensuales: 460 },
  { date: "2024-06-10", comprasUltMes: 155, usuariosNuevos: 200, ingresos_mensuales: 681 },
  { date: "2024-06-11", comprasUltMes: 92, usuariosNuevos: 150, ingresos_mensuales: 780 },
  { date: "2024-06-12", comprasUltMes: 492, usuariosNuevos: 420, ingresos_mensuales: 523 },
  { date: "2024-06-13", comprasUltMes: 81, usuariosNuevos: 130, ingresos_mensuales: 123 },
  { date: "2024-06-14", comprasUltMes: 426, usuariosNuevos: 380, ingresos_mensuales: 146 },
  { date: "2024-06-15", comprasUltMes: 307, usuariosNuevos: 350, ingresos_mensuales: 712 },
  { date: "2024-06-16", comprasUltMes: 371, usuariosNuevos: 310, ingresos_mensuales: 366 },
  { date: "2024-06-17", comprasUltMes: 475, usuariosNuevos: 520, ingresos_mensuales: 456 },
  { date: "2024-06-18", comprasUltMes: 107, usuariosNuevos: 170, ingresos_mensuales: 651 },
  { date: "2024-06-19", comprasUltMes: 341, usuariosNuevos: 290, ingresos_mensuales: 146 },
  { date: "2024-06-20", comprasUltMes: 408, usuariosNuevos: 450, ingresos_mensuales: 111 },
  { date: "2024-06-21", comprasUltMes: 169, usuariosNuevos: 210, ingresos_mensuales: 222 },
  { date: "2024-06-22", comprasUltMes: 317, usuariosNuevos: 270, ingresos_mensuales: 666 },
  { date: "2024-06-23", comprasUltMes: 480, usuariosNuevos: 530, ingresos_mensuales: 213 },
  { date: "2024-06-24", comprasUltMes: 132, usuariosNuevos: 180, ingresos_mensuales: 777 },
  { date: "2024-06-25", comprasUltMes: 141, usuariosNuevos: 190, ingresos_mensuales: 751 },
  { date: "2024-06-26", comprasUltMes: 434, usuariosNuevos: 380, ingresos_mensuales: 456 },
  { date: "2024-06-27", comprasUltMes: 448, usuariosNuevos: 490, ingresos_mensuales: 665 },
  { date: "2024-06-28", comprasUltMes: 149, usuariosNuevos: 200, ingresos_mensuales: 778 },
  { date: "2024-06-29", comprasUltMes: 103, usuariosNuevos: 160, ingresos_mensuales: 354 },
  { date: "2024-06-30", comprasUltMes: 446, usuariosNuevos: 400, ingresos_mensuales: 468 },
]


const chartConfig = {
  compras: {
    label: "compras en el ultimo mes",
    color: "#337aff",
  },
  usuarios: {
    label: "Usuarios nuevos",
    color: "#337aff ",
  },
  ingresos: {
    label: "Ingresos mensuales",
    color: "#337aff ",
  },
} satisfies ChartConfig


export function Grafico() {

  const chartDataUltimos30 = React.useMemo(() => { //sistema de filtrado para los ultimos 30 dias
    if (chartData.length <= 30) return chartData;
    return chartData.slice(-30);
  }, []);
  
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("compras")
  const ultimoDato = chartDataUltimos30[chartDataUltimos30.length - 1];
  const total = React.useMemo(() => ({
  compras: ultimoDato.comprasUltMes,
  usuarios: ultimoDato.usuariosNuevos,
  ingresos: ultimoDato.ingresos_mensuales,
}), [ultimoDato]);


     const getCambio = (key: "comprasUltMes" | "usuariosNuevos" | "ingresos_mensuales") => {
     const currentIndex = chartDataUltimos30.length - 1;
    if (currentIndex <= 0) return 0;
    const prevValue = chartData[currentIndex - 1][key];
    const currValue = chartData[currentIndex][key];
    if (prevValue === 0) return 0;
    return ((currValue - prevValue) / prevValue) * 100;
  };


  return (
    <>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
  <CardResumen
    icon={MdOutlineShoppingCart}
    titulo="Compras en el último mes"
    valor={total.compras.toLocaleString()}
    cambio={getCambio("comprasUltMes")}
    onClick={() => setActiveChart("compras")}
  />
  <CardResumen
    icon={AiOutlineUser}
    titulo="Usuarios nuevos"
    valor={total.usuarios.toLocaleString()}
    cambio={getCambio("usuariosNuevos")}
    onClick={() => setActiveChart("usuarios")}
  />
  <CardResumen
    icon={PiMoneyWavyLight}
    titulo="Ingresos mensuales"
    valor={`$${total.ingresos.toLocaleString()}`}
    cambio={getCambio("ingresos_mensuales")}
    onClick={() => setActiveChart("ingresos")}
  />
</div>
<Card>
  <CardContent className="px-2 sm:p-6">
  <ChartContainer
    config={chartConfig}
    className="aspect-auto h-[250px] w-full overflow-x-auto"
  >
    <BarChart
      data={chartDataUltimos30} //cambio de funcion a la de filtrado
      margin={{ left: 12, right: 12 }}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="date"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={32}
        tickFormatter={(value) => {
          const date = new Date(value);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }}
      />
      <ChartTooltip
        content={
          <ChartTooltipContent
            className="w-[150px]"
            nameKey="views"
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />
        }
      />
      <Bar
        dataKey={
          activeChart === "compras"
            ? "comprasUltMes"
            : activeChart === "usuarios"
            ? "usuariosNuevos"
            : "ingresos_mensuales"
        }
        fill={chartConfig[activeChart].color}
      />
    </BarChart>
  </ChartContainer>
</CardContent>
</Card>

  </>
  )
}
