// src/components/CartTestComponent.tsx
'use client';

import { useState } from 'react';
import { useCartWithBackend } from '@/hooks/useCartWithBackend';
import { cartApiService } from '@/services/cartApi';
import { useProducts } from '@/hooks/useProduct';

export const CartTestComponent = () => {
  const [testProfileId, setTestProfileId] = useState<number>(1);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const cart = useCartWithBackend(testProfileId);
  const { Products } = useProducts();
  
  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('🚀 Starting cart tests...');

    try {
      // Test 1: API Health Check
      addResult('Test 1: Checking API health...');
      const isHealthy = await cartApiService.healthCheck();
      addResult(`✅ API Health: ${isHealthy ? 'OK' : 'FAILED'}`);

      // Test 2: Load Cart
      addResult('Test 2: Loading cart...');
      await cart.refreshCart();
      addResult(`✅ Cart loaded: ${cart.items.length} items`);

      // Test 3: Add Product to Cart (if products available)
      if (Products.length > 0) {
        const testProduct = Products[0];
        addResult(`Test 3: Adding product "${testProduct.ProductName}" to cart...`);
        
        try {
          await cart.addToCart(testProduct, 1);
          addResult(`✅ Product added successfully`);
        } catch (error) {
          addResult(`❌ Failed to add product: ${error}`);
        }
      } else {
        addResult('⚠️ Test 3: Skipped - No products available');
      }

      // Test 4: Check cart state
      addResult('Test 4: Checking cart state...');
      addResult(`📊 Items in cart: ${cart.itemCount()}`);
      addResult(`💰 Cart total: $${cart.getTotal()}`);
      addResult(`🔄 Loading state: ${cart.loading}`);
      addResult(`❌ Error state: ${cart.error || 'None'}`);

    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
    }

    setIsRunning(false);
    addResult('🏁 Tests completed!');
  };

  const clearCart = async () => {
    addResult('🧹 Clearing cart...');
    try {
      // Remove all items one by one
      for (const item of cart.items) {
        await cart.removeFromCart(item.ProductID);
      }
      addResult('✅ Cart cleared successfully');
    } catch (error) {
      addResult(`❌ Error clearing cart: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🛒 Cart Backend Connection Test</h2>
        
        {/* Profile ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Test Profile ID:
          </label>
          <input
            type="number"
            value={testProfileId}
            onChange={(e) => setTestProfileId(Number(e.target.value))}
            className="border rounded px-3 py-2 w-32"
            min="1"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isRunning ? '🔄 Running Tests...' : '🧪 Run Connection Tests'}
          </button>
          
          <button
            onClick={clearCart}
            disabled={isRunning}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            🧹 Clear Cart
          </button>
          
          <button
            onClick={() => setTestResults([])}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            📋 Clear Log
          </button>
        </div>

        {/* Current Cart Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold">📦 Items</h3>
            <p className="text-2xl font-bold">{cart.itemCount()}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold">💰 Total</h3>
            <p className="text-2xl font-bold">${cart.getTotal().toFixed(2)}</p>
          </div>
          
          <div className={`p-4 rounded ${cart.loading ? 'bg-yellow-50' : cart.error ? 'bg-red-50' : 'bg-green-50'}`}>
            <h3 className="font-semibold">🔄 Status</h3>
            <p className="text-sm">
              {cart.loading ? 'Loading...' : cart.error ? 'Error' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Cart Items */}
        {cart.items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">🛒 Current Cart Items:</h3>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.ProductID} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div>
                    <span className="font-medium">{item.ProductName}</span>
                    <span className="text-gray-500 ml-2">Qty: {item.prodcutQuantity}</span>
                    {item.cartItemId && (
                      <span className="text-xs text-green-600 ml-2">(Backend ID: {item.cartItemId})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">${(item.productPrice * item.prodcutQuantity).toFixed(2)}</span>
                    <button
                      onClick={() => cart.removeFromCart(item.ProductID)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Results Log */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">📋 Test Results Log:</h3>
          </div>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click "Run Connection Tests" to start.</p>
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