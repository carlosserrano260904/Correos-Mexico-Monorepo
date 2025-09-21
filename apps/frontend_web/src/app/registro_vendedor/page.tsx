'use client';

import { Plantilla } from '@/components/plantilla';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegistroVendedor: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre_tienda: '',
    categoria_tienda: '',
    telefono: '',
    direccion_fiscal: '',
    userId: '',
    rfc: '',         // <-- Agrega este campo
    curp: '',        // <-- Agrega este campo
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generarNumeroSeguimiento = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = Math.floor(100000000 + Math.random() * 900000000);
    const letra = letras.charAt(Math.floor(Math.random() * letras.length));
    return `${letra}${numeros}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3000/api/vendedor/crear-solicitud', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Si el backend regresa el número de seguimiento, úsalo aquí
      // const data = await response.json();
      // const numeroSeguimiento = data.numeroSeguimiento || generarNumeroSeguimiento();

      const numeroSeguimiento = generarNumeroSeguimiento();
      const fecha = encodeURIComponent(new Date().toISOString());
      router.push(`/estatus_solicitud?seguimiento=${numeroSeguimiento}&fecha=${fecha}`);
    } else {
      alert('Hubo un error al enviar la solicitud. Intenta de nuevo.');
    }
  } catch (error) {
    alert('Error de conexión con el servidor.');
  }
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
              <label className="block text-sm font-semibold text-gray-700">Nombre de la tienda</label>
              <input
                type="text"
                name="nombre_tienda"
                value={formData.nombre_tienda}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Dirección fiscal</label>
              <input
                type="text"
                name="direccion_fiscal"
                value={formData.direccion_fiscal}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">ID de usuario</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
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
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Categoría de productos</label>
              <select
                name="categoria_tienda"
                value={formData.categoria_tienda}
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
