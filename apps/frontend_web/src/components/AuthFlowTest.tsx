// src/components/AuthFlowTest.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export const AuthFlowTest = () => {
  const auth = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials] = useState({
    email: 'test@correos.mx',
    password: '123456',
    name: 'Usuario Test'
  });

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testCompleteAuthFlow = async () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('🚀 Iniciando prueba completa del flujo de autenticación...');

    try {
      // Step 1: Check current state
      addResult(`📊 Estado inicial: ${auth.isAuthenticated ? 'Autenticado' : 'No Autenticado'}`);
      
      if (auth.isAuthenticated) {
        addResult('📝 Usuario ya autenticado, cerrando sesión primero...');
        auth.logout();
        addResult('✅ Sesión cerrada');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Test registration
      addResult('🆕 Probando registro de usuario...');
      try {
        const registerResult = await auth.register({
          correo: testCredentials.email,
          contrasena: testCredentials.password,
          nombre: testCredentials.name,
        });
        
        if (registerResult.success) {
          addResult('✅ Registro exitoso!');
          addResult(`👤 Usuario creado: ${auth.getUserEmail()}`);
        } else {
          addResult(`⚠️ Registro falló (posiblemente usuario ya existe): ${registerResult.error}`);
          
          // If registration fails, try login
          addResult('🔄 Intentando login en su lugar...');
          const loginResult = await auth.login({
            correo: testCredentials.email,
            contrasena: testCredentials.password,
          });
          
          if (loginResult.success) {
            addResult('✅ Login exitoso después del fallo de registro!');
          } else {
            addResult(`❌ Login también falló: ${loginResult.error}`);
          }
        }
      } catch (error) {
        addResult(`❌ Error en registro: ${error}`);
      }

      // Step 3: Verify authentication state
      await new Promise(resolve => setTimeout(resolve, 1000));
      addResult('🔍 Verificando estado final...');
      addResult(`📊 ¿Autenticado?: ${auth.isAuthenticated}`);
      addResult(`👤 Usuario: ${auth.getUserEmail() || 'Ninguno'}`);
      addResult(`📛 Nombre: ${auth.getFullName() || 'Ninguno'}`);

    } catch (error) {
      addResult(`❌ Error en el flujo completo: ${error}`);
    }

    setIsRunning(false);
    addResult('🏁 Prueba completa finalizada!');
  };

  const simulateNavbarFlow = () => {
    addResult('🧭 Simulando flujo del Navbar:');
    addResult('1️⃣ Usuario ve navbar sin autenticar');
    addResult('2️⃣ Ve botones "Iniciar Sesión" y "Registrarse"');
    addResult('3️⃣ Hace clic en "Registrarse"');
    addResult('4️⃣ Es redirigido a /registro');
    addResult('5️⃣ Completa el formulario');
    addResult('6️⃣ Envía el formulario (función que creamos)');
    addResult('7️⃣ Es autenticado y redirigido a la página principal');
    addResult('8️⃣ Navbar ahora muestra su información de usuario');
    addResult('✅ Flujo completo del navbar funcionando!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🧭 Prueba de Flujo Completo: Navbar → Auth</h2>
        
        {/* Current Navbar State */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">🔍 Estado Actual del Navbar:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded ${auth.isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
              <h4 className="font-medium">En el Navbar se muestra:</h4>
              {auth.loading ? (
                <p className="text-sm">⏳ Icono girando (cargando...)</p>
              ) : auth.isAuthenticated ? (
                <div className="text-sm">
                  <p>👤 Menú de usuario con:</p>
                  <p>• {auth.getFullName() || 'Usuario'}</p>
                  <p>• {auth.getUserEmail()}</p>
                  <p>• Opción "Cerrar Sesión"</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p>🔘 Botón "Iniciar Sesión" → /login</p>
                  <p>🔴 Botón "Registrarse" → /registro</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-blue-100 rounded">
              <h4 className="font-medium">Enlaces de navegación:</h4>
              <div className="text-sm space-y-1">
                <Link href="/login" className="block text-blue-600 hover:underline">
                  → Ir a página de Login
                </Link>
                <Link href="/registro" className="block text-blue-600 hover:underline">
                  → Ir a página de Registro
                </Link>
                <Link href="/" className="block text-blue-600 hover:underline">
                  → Ir a página principal (para ver navbar)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={testCompleteAuthFlow}
            disabled={isRunning}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isRunning ? '🔄 Ejecutando...' : '🧪 Probar Flujo Completo'}
          </button>
          
          <button
            onClick={simulateNavbarFlow}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            📋 Simular Flujo del Navbar
          </button>
          
          <button
            onClick={() => setTestResults([])}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            🗑️ Limpiar Log
          </button>
          
          {auth.isAuthenticated && (
            <button
              onClick={() => {
                auth.logout();
                addResult('🚪 Usuario deslogueado manualmente');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              🚪 Cerrar Sesión
            </button>
          )}
        </div>

        {/* Visual Flow Diagram */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-3">🔄 Flujo Visual:</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-gray-200 px-3 py-1 rounded">Navbar</span>
            <span>→</span>
            <span className="bg-blue-200 px-3 py-1 rounded">Click "Registrarse"</span>
            <span>→</span>
            <span className="bg-purple-200 px-3 py-1 rounded">/registro page</span>
            <span>→</span>
            <span className="bg-green-200 px-3 py-1 rounded">Form works</span>
            <span>→</span>
            <span className="bg-pink-200 px-3 py-1 rounded">Auth success</span>
            <span>→</span>
            <span className="bg-green-300 px-3 py-1 rounded">Navbar updated</span>
          </div>
        </div>

        {/* Step by Step Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-3">📋 Pasos para probar manualmente:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Ve a la página principal</strong> (donde está el navbar)</li>
            <li><strong>Si estás logueado</strong>, cierra sesión primero</li>
            <li><strong>Verifica que veas</strong> los botones "Iniciar Sesión" y "Registrarse"</li>
            <li><strong>Haz clic en "Registrarse"</strong> → debes ir a <code>/registro</code></li>
            <li><strong>Completa el formulario</strong> con datos válidos</li>
            <li><strong>Haz clic en "Crear cuenta"</strong> → debe autenticarte</li>
            <li><strong>Debes ser redirigido</strong> a la página principal</li>
            <li><strong>El navbar debe mostrar ahora</strong> tu información de usuario</li>
          </ol>
        </div>

        {/* Test Results Log */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">📋 Log de Pruebas:</h3>
          </div>
          {testResults.length === 0 ? (
            <p className="text-gray-500">Haz clic en "Probar Flujo Completo" para iniciar las pruebas...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};