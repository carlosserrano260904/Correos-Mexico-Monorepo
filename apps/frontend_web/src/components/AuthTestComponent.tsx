// src/components/AuthTestComponent.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authApiService } from '@/services/authApi';
import { profileApiService } from '@/services/profileApi';

export const AuthTestComponent = () => {
  const auth = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'test@test.com',
    password: '123456',
    name: 'Test User'
  });

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runAuthTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('🚀 Starting auth tests...');

    try {
      // Test 1: API Health Check
      addResult('Test 1: Checking Auth API health...');
      const isAuthHealthy = await authApiService.healthCheck();
      addResult(`✅ Auth API Health: ${isAuthHealthy ? 'OK' : 'FAILED'}`);

      // Test 2: Profile API Health Check
      addResult('Test 2: Checking Profile API health...');
      const isProfileHealthy = await profileApiService.healthCheck();
      addResult(`✅ Profile API Health: ${isProfileHealthy ? 'OK' : 'FAILED'}`);

      // Test 3: Current auth status
      addResult('Test 3: Checking current auth status...');
      addResult(`📊 Is Authenticated: ${auth.isAuthenticated}`);
      addResult(`👤 Current User: ${auth.user?.correo || 'None'}`);
      addResult(`👤 Profile: ${auth.profile?.nombre || 'None'}`);
      addResult(`🔄 Loading: ${auth.loading}`);
      addResult(`❌ Error: ${auth.error || 'None'}`);

    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
    }

    setIsRunning(false);
    addResult('🏁 Tests completed!');
  };

  const testRegister = async () => {
    addResult('🔐 Testing registration...');
    try {
      const result = await auth.register({
        correo: testCredentials.email,
        contrasena: testCredentials.password,
        nombre: testCredentials.name,
      });
      
      if (result.success) {
        addResult('✅ Registration successful!');
      } else {
        addResult(`❌ Registration failed: ${result.error}`);
      }
    } catch (error) {
      addResult(`❌ Registration error: ${error}`);
    }
  };

  const testLogin = async () => {
    addResult('🔐 Testing login...');
    try {
      const result = await auth.login({
        correo: testCredentials.email,
        contrasena: testCredentials.password,
      });
      
      if (result.success) {
        addResult('✅ Login successful!');
        // Reload user data
        setTimeout(async () => {
          await auth.refreshUserData();
          addResult('✅ User data refreshed');
        }, 1000);
      } else {
        addResult(`❌ Login failed: ${result.error}`);
      }
    } catch (error) {
      addResult(`❌ Login error: ${error}`);
    }
  };

  const testLogout = () => {
    addResult('🚪 Testing logout...');
    auth.logout();
    addResult('✅ Logout completed');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🔐 Auth & Profile Backend Connection Test</h2>
        
        {/* Test Credentials */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Email:</label>
            <input
              type="email"
              value={testCredentials.email}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Test Password:</label>
            <input
              type="password"
              value={testCredentials.password}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Test Name:</label>
            <input
              type="text"
              value={testCredentials.name}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, name: e.target.value }))}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={runAuthTests}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isRunning ? '🔄 Running Tests...' : '🧪 Run Health Check'}
          </button>
          
          <button
            onClick={testRegister}
            disabled={isRunning || auth.loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            🆕 Test Register
          </button>
          
          <button
            onClick={testLogin}
            disabled={isRunning || auth.loading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            🔑 Test Login
          </button>
          
          <button
            onClick={testLogout}
            disabled={isRunning || auth.loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            🚪 Test Logout
          </button>
          
          <button
            onClick={() => setTestResults([])}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            📋 Clear Log
          </button>
        </div>

        {/* Current Auth Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded ${auth.isAuthenticated ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className="font-semibold">🔐 Auth Status</h3>
            <p className="text-sm">{auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
          </div>
          
          <div className={`p-4 rounded ${auth.loading ? 'bg-yellow-50' : 'bg-gray-50'}`}>
            <h3 className="font-semibold">⏳ Loading</h3>
            <p className="text-sm">{auth.loading ? 'Loading...' : 'Ready'}</p>
          </div>
          
          <div className={`p-4 rounded ${auth.error ? 'bg-red-50' : 'bg-green-50'}`}>
            <h3 className="font-semibold">❌ Error</h3>
            <p className="text-xs">{auth.error || 'None'}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold">👤 User</h3>
            <p className="text-xs">{auth.getUserEmail() || 'None'}</p>
          </div>
        </div>

        {/* User Info */}
        {auth.isAuthenticated && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-semibold mb-3">👤 Current User Info:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">User Data:</h4>
                <pre className="text-xs bg-white p-2 rounded mt-1">
                  {JSON.stringify(auth.user, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium">Profile Data:</h4>
                <pre className="text-xs bg-white p-2 rounded mt-1">
                  {JSON.stringify(auth.profile, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Test Results Log */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">📋 Test Results Log:</h3>
          </div>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click buttons above to start testing.</p>
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