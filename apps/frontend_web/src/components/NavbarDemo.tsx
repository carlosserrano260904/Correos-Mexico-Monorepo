// src/components/NavbarDemo.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export const NavbarDemo = () => {
  const auth = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🧭 Estado del Navbar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded ${auth.isAuthenticated ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="font-semibold">🔐 Estado de Autenticación</h3>
          <p className="text-sm">
            {auth.loading ? (
              '⏳ Cargando...'
            ) : auth.isAuthenticated ? (
              '✅ Usuario Autenticado'
            ) : (
              '❌ Usuario No Autenticado'
            )}
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold">👤 Usuario Actual</h3>
          <p className="text-sm">{auth.getUserEmail() || 'Ninguno'}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-semibold">🧭 Vista del Navbar</h3>
          <p className="text-sm">
            {auth.loading ? (
              'Icono girando'
            ) : auth.isAuthenticated ? (
              'Menú de usuario'
            ) : (
              'Botones Login/Registro'
            )}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-3">📋 Lo que verá el usuario en el navbar:</h3>
        
        {auth.loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin">⏳</div>
            <span>Icono de usuario girando (cargando estado de autenticación)</span>
          </div>
        ) : auth.isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#DE1484] text-white rounded-full flex items-center justify-center text-sm">
                {auth.getUserName()?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium">{auth.getFullName() || 'Usuario'}</p>
                <p className="text-sm text-gray-500">{auth.getUserEmail()}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Al hacer clic: menú desplegable con perfil, historial, favoritos, etc.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              disabled
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors min-h-[45px] cursor-not-allowed"
            >
              Iniciar Sesión
            </button>
            <button 
              disabled
              className="px-4 py-2 text-sm font-medium text-white bg-[#DE1484] hover:bg-pink-600 rounded-full transition-colors min-h-[45px] cursor-not-allowed"
            >
              Registrarse
            </button>
            <p className="text-sm text-gray-600 ml-2">
              (Botones funcionales que redirigen a /login y /registro)
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">🎨 Colores Utilizados (Coinciden con tu proyecto):</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#DE1484] rounded"></div>
            <span>Primary Pink: #DE1484</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#F3F4F6] border rounded"></div>
            <span>Background Gray: #F3F4F6</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-600 rounded"></div>
            <span>Hover Pink: pink-600</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border rounded"></div>
            <span>Hover Gray: gray-100</span>
          </div>
        </div>
      </div>
    </div>
  );
};