'use client'
import React, { useState } from 'react';
import Link from 'next/link';

// Componentes externos
import { Plantilla } from '@/components/plantilla';
import BotonRegresar from '@/components/BotonRegresar';

// Interfaz para el estado del formulario
interface CardFormData {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export default function AgregarTarjetasPage() {
  const [formData, setFormData] = useState<CardFormData>({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------------------
  // MANEJO DE INPUTS Y FORMATO
  // ----------------------------------------------------------------------

  const formatCardNumber = (value: string) => {
    // Solo permite dígitos
    const digits = value.replace(/\D/g, '').substring(0, 16);
    // Agrega espacios cada 4 dígitos
    return digits.match(/.{1,4}/g)?.join(' ') || '';
  };

  const formatExpiry = (value: string) => {
    // Solo permite dígitos y formato MM/YY
    const digits = value.replace(/\D/g, '').substring(0, 4);
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // ----------------------------------------------------------------------
  // TODO: BACKEND INTEGRATION - POST
  // Función para enviar los datos al servidor
  // ----------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación básica
    if (!formData.number || formData.number.length < 19 || !formData.name || !formData.expiry || formData.expiry.length < 5 || !formData.cvc || formData.cvc.length < 3) {
      setError('Por favor, completa todos los campos correctamente.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Prepara los datos limpios para el backend
      const cleanData = {
        cardNumber: formData.number.replace(/\s/g, ''),
        cardHolder: formData.name,
        // Usar lógica para dividir MM y AA si es necesario, 
        // o enviar como string 'MM/AA'
        expiry: formData.expiry, 
        cvc: formData.cvc
      };

      console.log('Datos a enviar al backend:', cleanData);

      // 2. Realiza la llamada a la API (descomentar y completar con tu endpoint)
      // const response = await fetch('/api/user/cards', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(cleanData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error al guardar la tarjeta.');
      // }
      
      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      alert('¡Tarjeta añadida con éxito! Redirigiendo...');
      // Redirigir a la lista de tarjetas
      // router.push('/perfil/tarjetas'); 
      
    } catch (err) {
      setError('Error en la transacción. Intenta nuevamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lógica para mostrar los últimos 4 dígitos y la expiración en la tarjeta visual
  const lastFour = formData.number.replace(/\s/g, '').slice(-4) || '••••';
  const displayExpiry = formData.expiry || 'MM/AA';

  return (
    <Plantilla>
      {/* 1. Navbar */}

      {/* 2. Contenido del Formulario */}
      <div className="w-full min-h-[70vh] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <BotonRegresar />
          
          <h1 className="text-4xl font-bold text-black mb-10">
            Agregar nueva tarjeta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="w-full bg-[#F9F9F9] rounded-[20px] p-6 md:p-10 flex flex-col lg:flex-row items-start gap-10 shadow-sm">
              
              {/* Columna Izquierda: Formulario */}
              <div className="flex-1 w-full space-y-6">
                
                {/* Campo Número de tarjeta */}
                <div>
                  <label htmlFor="number" className="block text-lg font-medium text-gray-800 mb-2">
                    Número de tarjeta
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={formData.number}
                    onChange={handleInputChange}
                    maxLength={19} // 16 dígitos + 3 espacios
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-[#DE1484] transition-colors"
                    required
                  />
                </div>

                {/* Campo Nombre en la tarjeta */}
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-2">
                    Nombre en la tarjeta
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nombre y apellidos"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-[#DE1484] transition-colors"
                    required
                  />
                </div>

                {/* Campos Vence y CVC (en una sola fila) */}
                <div className="flex gap-6">
                  {/* Vence */}
                  <div className="w-1/2">
                    <label htmlFor="expiry" className="block text-lg font-medium text-gray-800 mb-2">
                      Vence
                    </label>
                    <input
                      id="expiry"
                      name="expiry"
                      type="text"
                      placeholder="MM/AA"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      maxLength={5} // MM/AA
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-[#DE1484] transition-colors"
                      required
                    />
                  </div>
                  
                  {/* CVC */}
                  <div className="w-1/2">
                    <label htmlFor="cvc" className="block text-lg font-medium text-gray-800 mb-2">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      name="cvc"
                      type="password"
                      placeholder="CVC"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      maxLength={4} 
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-[#DE1484] transition-colors"
                      required
                    />
                  </div>
                </div>

              </div>
              
              {/* Columna Derecha: Tarjeta Visual */}
              <div className="w-full lg:w-[320px] h-[200px] flex-shrink-0 flex items-center justify-center">
                {/* Tarjeta Simulación (Estilo Rosado de la imagen) */}
                <div 
                  className={`
                    w-full max-w-[300px] h-[180px] rounded-xl p-5 flex flex-col justify-between text-white shadow-xl relative overflow-hidden flex-shrink-0
                    bg-gradient-to-r from-[#F06292] to-[#E91E63]
                  `}
                >
                  {/* Nombre Arriba */}
                  <div className="z-10">
                    <p className="text-[10px] font-medium opacity-90 mb-0.5">Nombre y Apellido</p>
                    <p className="font-medium tracking-wide uppercase">{formData.name || 'Nombre y apellidos'}</p>
                  </div>

                  {/* Número y CVC */}
                  <div className="z-10 text-center flex justify-between items-center text-xl font-mono tracking-widest mt-4">
                     {/* Simula el número oculto */}
                     <span className="opacity-70 text-base">••••</span>
                     <span className="opacity-70 text-base">••••</span>
                     <span className="opacity-70 text-base">••••</span>
                     <span className="text-xl">{lastFour}</span>
                  </div>

                  {/* Fecha y CVC */}
                  <div className="z-10 flex justify-between items-end mt-4">
                    <div className="text-xs">
                        <p className="opacity-80">Vence</p>
                        <p className="font-medium tracking-wide">{displayExpiry}</p>
                    </div>
                    {/* CVC Simulado */}
                    <div className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">
                        <span className="opacity-80 text-white">CVC</span>
                    </div>
                  </div>

                  {/* Decoración de fondo */}
                  <div className="absolute top-[-50%] right-[-20%] w-60 h-60 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            {/* Botón de Enviar */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#DE1484] hover:bg-pink-700 text-white font-bold py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                    </span>
                ) : (
                    'Añadir tarjeta'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Footer */}
    </Plantilla>
  )
}