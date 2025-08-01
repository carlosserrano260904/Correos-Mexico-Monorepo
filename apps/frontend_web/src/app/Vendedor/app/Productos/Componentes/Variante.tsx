import React from 'react';
import { FiUpload } from "react-icons/fi";
import {FormularioProductoData} from "../../../../../types/interface"




interface VarianteProps {
  numero?: number;
  onSubmit?: (data: FormularioProductoData) => void;
  onFileChange?: (files: File[]) => void;
  initialData?: Partial<FormularioProductoData>;
  className?: string;
}

export const Variante: React.FC<VarianteProps> = () => (
  <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 space-y-6">
    <h3 className="text-base font-semibold text-gray-900 mb-3">Variante 1</h3>

    {/* Tipo y Valor */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="variante1_tipo" className="block text-base font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <select
          id="variante1_tipo"
          name="variante1_tipo"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          defaultValue="Tipo"
        >
          <option disabled>Tipo</option>
          <option>Color</option>
          <option>Talla</option>
        </select>
      </div>
      <div>
        <label htmlFor="variante1_valor" className="block text-base font-medium text-gray-700 mb-1">
          Valor
        </label>
        <input
          type="text"
          id="variante1_valor"
          name="variante1_valor"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    {/* Inventario */}
    <div>
      <label htmlFor="variante1_inventario" className="block text-base font-medium text-gray-700 mb-1">
        Inventario
      </label>
      <p className="text-xs text-gray-500 mb-2">Unidades disponibles en existencia.</p>
      <input
        type="number"
        id="variante1_inventario"
        name="variante1_inventario"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>

    {/* Imágenes */}
    <div>
      <label className="block text-base font-medium text-gray-700 mb-1">
        Imágenes
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
        <div className="space-y-1 text-center">
          <FiUpload className="mx-auto h-6 w-6 text-black" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md text-xs text-gray-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Arrastra y suelta o haz clic para seleccionar un archivo</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
            </label>
          </div>
        </div>
      </div>
    </div>

    {/* SKU */}
    <div>
      <label htmlFor="variante1_sku" className="block text-base font-medium text-gray-400 mb-1">
        SKU
      </label>
      <input
        type="text"
        id="variante1_sku"
        name="variante1_sku"
        readOnly
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
      />
    </div>
  </div>
);
