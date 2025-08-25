'use client'

import React, { useState } from 'react';
import { authApiService } from '@/services/authApi';

export const AuthDebugComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      addLog('🧪 Iniciando test de conexión...');
      
      // Test 1: Check stored token
      const token = authApiService.getAuthToken();
      addLog(`🔑 Token almacenado: ${token ? 'SÍ' : 'NO'}`);
      if (token) {
        addLog(`   Token: ${token.substring(0, 20)}...`);
      }
      
      // Test 2: Check stored user
      const storedUser = authApiService.getStoredUser();
      addLog(`👤 Usuario almacenado: ${storedUser ? 'SÍ' : 'NO'}`);
      if (storedUser) {
        addLog(`   Email: ${storedUser.correo}`);
        addLog(`   Nombre: ${storedUser.nombre || 'N/A'}`);
      }
      
      // Test 3: Health check
      addLog('🏥 Realizando health check...');
      const health = await authApiService.healthCheck();
      addLog(`   Resultado: ${health.isHealthy ? '✅ SALUDABLE' : '❌ NO DISPONIBLE'}`);
      if (!health.isHealthy && health.error) {
        addLog(`   Error: ${health.error}`);
      }
      
      // Test 4: Try getCurrentUser if we have a token
      if (token) {
        addLog('👤 Intentando obtener usuario actual...');
        try {
          const user = await authApiService.getCurrentUser();
          addLog('✅ Usuario obtenido correctamente:');
          addLog(`   Email: ${user.correo}`);
          addLog(`   Nombre: ${user.nombre || 'N/A'}`);
          addLog(`   Profile ID: ${user.profile?.id || 'N/A'}`);
        } catch (error) {
          addLog('❌ Error obteniendo usuario:');
          addLog(`   ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      } else {
        addLog('⚠️ No hay token, saltando test de getCurrentUser');
      }
      
      addLog('🏁 Test completado');
      
    } catch (error) {
      addLog(`❌ Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
    
    setIsLoading(false);
  };

  const clearStorage = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('temp_signup_data');
    addLog('🗑️ Storage limpiado');
  };

  const checkServerEnvironment = () => {
    addLog('🌍 Verificando variables de entorno...');
    addLog(`   NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'NO CONFIGURADA'}`);
    addLog(`   Fallback URL: http://localhost:3000/api`);
    addLog(`   Current baseURL: ${import.meta.env?.VITE_API_URL || 'DEFAULT'}`);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-4">🔍 Auth Debug Tool</h3>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Probando...' : '🧪 Test Connection'}
        </button>
        
        <button
          onClick={clearStorage}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🗑️ Clear Storage
        </button>
        
        <button
          onClick={checkServerEnvironment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🌍 Check Environment
        </button>
        
        <button
          onClick={() => setResults([])}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          🧹 Clear Logs
        </button>
      </div>
      
      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-500">Click "Test Connection" to start debugging...</div>
        ) : (
          results.map((result, index) => (
            <div key={index}>{result}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthDebugComponent;