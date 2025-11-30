'use client';

import { Plantilla } from '@/components/plantilla';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegistroVendedor: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    curp: '',
    rfc: '',
    direccion: '',
    codigoPostal: '',
    categoria: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convierte la CURP a mayúsculas
    if (name === 'curp') {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    }
    // Acepta solo dígitos en código postal
    else if (name === 'codigoPostal') {
      const numericValue = value.replace(/\D/g, ''); // 
      setFormData({ ...formData, [name]: numericValue });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const generarNumeroSeguimiento = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = Math.floor(100000000 + Math.random() * 900000000);
    const letra = letras.charAt(Math.floor(Math.random() * letras.length));
    return `${letra}${numeros}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);

    const numeroSeguimiento = generarNumeroSeguimiento();
    const fecha = encodeURIComponent(new Date().toISOString());

    router.push(`/estatus_solicitud?seguimiento=${numeroSeguimiento}&fecha=${fecha}`);
  };

  return (
    <Plantilla>
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-[#006666]">Registro de Vendedor</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">CURP</label>
              <input
                type="text"
                name="curp"
                value={formData.curp}
                onChange={handleChange}
                maxLength={18}
                className="mt-1 w-full border rounded-md px-3 py-2 uppercase focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">RFC</label>
              <input
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleChange}
                maxLength={13}
                className="mt-1 w-full border rounded-md px-3 py-2 uppercase focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Dirección del negocio</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Categoría de productos</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="ropa">Ropa</option>
                <option value="hogar">Hogar</option>
                <option value="joyeria">Joyeria</option>
                <option value="artesanías">Belleza y Cuidado</option>
                <option value="comida">Alimentos</option>
                <option value="cocina">Cocina</option>
                <option value="electronica">Electronica</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-full"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </Plantilla>
  );
};

export default RegistroVendedor;
