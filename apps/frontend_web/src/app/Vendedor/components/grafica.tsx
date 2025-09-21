// components/GraficaResumen.tsx

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type PuntoGrafica = {
  fecha: string;
  total: number;
};

type GraficaResumenProps = {
  titulo: string;
  datos: PuntoGrafica[];
};

export function GraficaResumen({ titulo, datos }: GraficaResumenProps) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
