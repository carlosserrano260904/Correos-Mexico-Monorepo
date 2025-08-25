// src/app/Vendedor/app/Productos/Components/Formulario.tsx
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { FiUpload, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useProducts } from '@/hooks/useProduct';
import { BtnLink } from '@/app/Vendedor/components/primitivos';
import { FrontendProduct } from '@/types';
import { uploadApiService } from '@/services/uploadapi';

interface FormularioData {
  ProductName: string;
  ProductDescription: string;
  productPrice: number;
  ProductSlug: string;
  ProductBrand: string;
  ProductCategory: string;
  variants: Array<{
    tipo: 'Color' | 'Talla';
    price: number;
    valor: string;
    inventario: number;
    sku: string;
  }>;
}

export const Formulario: React.FC = () => {
  const { addProduct } = useProducts();
  const router = useRouter();

  const [formData, setFormData] = useState<FormularioData>({
    ProductName: '',
    ProductDescription: '',
    productPrice: 0,
    ProductSlug: '',
    ProductBrand: '',
    ProductCategory: 'Electrónica',
    variants: [
      {
        tipo: 'Color',
        price: 0,
        valor: '',
        inventario: 0,
        sku: '',
      },
    ],
  });

  const [numVariantes, setNumVariantes] = useState(1);
  const [variantesVisibles, setVariantesVisibles] = useState<Record<number, boolean>>({
    1: true,
  });

  // Estado para el archivo de imagen seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const DEFAULT_SLUG_BASE_URL = 'https://www.correosclic.gob.mx/';

  const handleBasicFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: name === 'productPrice' ? parseFloat(value) || 0 : value,
      };

      if (name === 'ProductName') {
        updatedData.variants = prev.variants.map((variant, index) => ({
          ...variant,
          sku: variant.valor ? generateSKU(value, variant.valor, index) : '',
        }));
      }

      return updatedData;
    });
  };

  const generateSlug = () => {
    if (formData.ProductName.trim() === '') {
      setFormData((prev) => ({ ...prev, ProductSlug: '' }));
      return;
    }

    const generated = formData.ProductName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      ProductSlug: `${DEFAULT_SLUG_BASE_URL}${generated}`,
    }));
  };

  const generateSKU = (productName: string, variantValue: string, index: number): string => {
    const namePrefix = productName.substring(0, 3).toUpperCase() || 'PRD';
    const variantPrefix = variantValue.substring(0, 3).toUpperCase() || 'VAR';
    return `${namePrefix}-${variantPrefix}-${index + 1}`;
  };

  const handleVariantChange = (
    variantIndex: number,
    field: keyof FormularioData['variants'][0],
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedVariants = prev.variants.map((variant, index) => {
        if (index === variantIndex) {
          const updatedVariant = { ...variant, [field]: value };

          if (field === 'valor' && typeof value === 'string' && value.trim() !== '') {
            updatedVariant.sku = generateSKU(prev.ProductName, value, index);
          }

          return updatedVariant;
        }
        return variant;
      });

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  };

  const handleAddVariante = () => {
    const newVariantNumber = numVariantes + 1;
    setNumVariantes(newVariantNumber);
    setVariantesVisibles((prev) => ({ ...prev, [newVariantNumber]: true }));

    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          tipo: 'Color',
          price: 0,
          valor: '',
          inventario: 0,
          sku: '',
        },
      ],
    }));
  };

  const toggleVariantVisibility = (numero: number) => {
    setVariantesVisibles((prev) => ({
      ...prev,
      [numero]: !prev[numero],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    console.log('📷 Archivo seleccionado:', file);
  };

  const handleCrearProducto = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // si usas preventNavigation en el link
    try {
      console.log('selectedFile antes de subir:', selectedFile);
      console.log('🔍 Creando producto…');
      console.log('🔍 Archivo seleccionado:', selectedFile);

      const totalStock = formData.variants.reduce(
        (sum, variant) => sum + variant.inventario,
        0
      );
      const firstColorVariant = formData.variants.find(
        (v) => v.tipo === 'Color' && v.valor.trim() !== ''
      );
      const productColor = firstColorVariant?.valor || '#000000';

      const newProduct: Omit<FrontendProduct, 'ProductID'> = {
        ProductName: formData.ProductName,
        ProductDescription: formData.ProductDescription,
        productPrice: formData.productPrice,
        ProductCategory: formData.ProductCategory as 'Electrónica' | 'Ropa' | 'Hogar',
        ProductBrand: formData.ProductBrand,
        ProductSlug: formData.ProductSlug,
        ProductStock: totalStock,
        Color: productColor,
        ProductImageUrl: '', // se asignará más adelante
        ProductStatus: true,
        ProductSellerName: 'Admin',
        ProductSold: 0,
        ProductCupons: [],
        variants: formData.variants.filter(
          (v) => v.valor.trim() !== '' && v.inventario > 0
        ),
      };

      // Subir la imagen (si hay) y asignar el key
      if (selectedFile) {
        console.log('Subiendo imagen…');
        const key = await uploadApiService.uploadImage(selectedFile);
        newProduct.ProductImageUrl = key;
      } else {
        newProduct.ProductImageUrl = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';;
      }
      await addProduct(newProduct);
      router.push('/Vendedor/app/Productos');

      console.log('✅ Datos del producto listos para enviar:', newProduct);

      await addProduct(newProduct);
      console.log('🎉 Producto creado exitosamente');
      resetForm();
      router.push('/Vendedor/app/Productos');
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      alert('Error al crear producto. Revisa la consola.');
    }




    
  };

  const resetForm = () => {
    setFormData({
      ProductName: '',
      ProductDescription: '',
      productPrice: 1,
      ProductSlug: '',
      ProductBrand: '',
      ProductCategory: 'Electronica',
      variants: [
        {
          tipo: 'Color',
          price: 0,
          valor: '',
          inventario: 1,
          sku: '',
        },
      ],
    });
    setSelectedFile(null);
    setNumVariantes(1);
    setVariantesVisibles({ 1: true });
  };

  const AddVariantButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <IoIosAdd className="w-5 h-5 mr-2 text-gray-600" />
      Agregar nueva variante
    </button>
  );

  const renderSingleVariantForm = (numero: number) => {
    const isVisible = variantesVisibles[numero];
    const variantIndex = numero - 1;

    return (
      <div key={numero} className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleVariantVisibility(numero)}
        >
          <h3 className="text-base font-semibold text-gray-900">Variante {numero}</h3>
          {isVisible ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {isVisible && (
          <div className="p-4 pt-0 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={`variante${numero}_tipo`}
                  className="block text-base font-medium text-gray-700 mb-1"
                >
                  Tipo
                </label>
                <select
                  id={`variante${numero}_tipo`}
                  name={`variante${numero}_tipo`}
                  value={formData.variants[variantIndex]?.tipo || 'Color'}
                  onChange={(e) => {
                    const newTipo = e.target.value as 'Color' | 'Talla';
                    handleVariantChange(variantIndex, 'tipo', newTipo);
                    handleVariantChange(variantIndex, 'valor', '');
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Color">Color</option>
                  <option value="Talla">Talla</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={`variante${numero}_valor`}
                  className="block text-base font-medium text-gray-700 mb-1"
                >
                  {formData.variants[variantIndex]?.tipo === 'Color'
                    ? 'Color'
                    : formData.variants[variantIndex]?.tipo === 'Talla'
                      ? 'Talla'
                      : 'Valor'}
                </label>
                {formData.variants[variantIndex]?.tipo === 'Color' ? (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id={`variante${numero}_color`}
                      name={`variante${numero}_color`}
                      value={formData.variants[variantIndex]?.valor || '#000000'}
                      onChange={(e) =>
                        handleVariantChange(variantIndex, 'valor', e.target.value)
                      }
                      className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      id={`variante${numero}_valor`}
                      name={`variante${numero}_valor`}
                      value={formData.variants[variantIndex]?.valor || ''}
                      onChange={(e) =>
                        handleVariantChange(variantIndex, 'valor', e.target.value)
                      }
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                ) : formData.variants[variantIndex]?.tipo === 'Talla' ? (
                  <select
                    id={`variante${numero}_valor`}
                    name={`variante${numero}_valor`}
                    value={formData.variants[variantIndex]?.valor || ''}
                    onChange={(e) =>
                      handleVariantChange(variantIndex, 'valor', e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Selecciona una talla</option>
                    <option value="XCH">XCH</option>
                    <option value="CH">CH</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="XG">XG</option>
                    <option value="XXG">XXG</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    id={`variante${numero}_valor`}
                    name={`variante${numero}_valor`}
                    value={formData.variants[variantIndex]?.valor || ''}
                    onChange={(e) =>
                      handleVariantChange(variantIndex, 'valor', e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ingresa el valor"
                  />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor={`variante${numero}_inventario`}
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Inventario
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Unidades disponibles en existencia.
              </p>
              <input
                type="number"
                id={`variante${numero}_inventario`}
                name={`variante${numero}_inventario`}
                min={1}
                onChange={(e) =>
                  handleVariantChange(
                    variantIndex,
                    'inventario',
                    parseInt(e.target.value) || 0
                  )
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">
                Imágenes
              </label>
              <label
                htmlFor={`file-upload-${numero}`}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                tabIndex={0}
                role="button"
              >
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-6 w-6 text-black" />
                  <div className="flex text-sm text-gray-600">
                    <span>
                      Arrastra y suelta o haz clic para seleccionar un archivo
                    </span>
                    <input
                      id={`file-upload-${numero}`}
                      name={`file-upload-${numero}`}
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label
                htmlFor={`variante${numero}_sku`}
                className="block text-base font-medium text-gray-400 mb-1"
              >
                SKU
              </label>
              <input
                type="text"
                id={`variante${numero}_sku`}
                name={`variante${numero}_sku`}
                value={formData.variants[variantIndex]?.sku || ''}
                readOnly
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 p-4">
      {/* Detalles del Producto */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Detalles del Producto
        </h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="nombre"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="ProductName"
              value={formData.ProductName}
              onChange={handleBasicFieldChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Slug
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Identificador único del producto en la URL del sitio.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="slug"
                name="ProductSlug"
                readOnly
                value={formData.ProductSlug}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
              >
                Generar
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="ProductDescription"
              rows={4}
              value={formData.ProductDescription}
              onChange={handleBasicFieldChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Categoría
            </label>
            <select
              id="categoria"
              name="ProductCategory"
              value={formData.ProductCategory}
              onChange={handleBasicFieldChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Categoria" disabled>
                Categoria
              </option>
              <option value="Joyeria y Bisuteria">Joyeria y Bisuteria</option>
              <option value="Ropa">Ropa</option>
              <option value="Hogar">Hogar</option>
              <option value="Alimentos y bebidas">Alimentos y bebidas</option>
              <option value="Belleza y cuidado personal">
                Belleza y cuidado personal
              </option>
              <option value="Cocina">Cocina</option>
              <option value="Electronica">Electronica</option>
              <option value="Herramienta">Herramienta</option>
              <option value="Artesanal">Artesanal</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="marca"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Marca
            </label>
            <input
              type="text"
              id="marca"
              name="ProductBrand"
              value={formData.ProductBrand}
              onChange={handleBasicFieldChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="Precio"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Precio
            </label>
            <input
              type="number"
              id="Precio"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleBasicFieldChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </form>
      </section>

      {/* Variantes del Producto */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Variantes del Producto
        </h2>
        <div className="space-y-6">
          {Array.from({ length: numVariantes }).map((_, index) =>
            renderSingleVariantForm(index + 1)
          )}
          <AddVariantButton onClick={handleAddVariante} />
        </div>
      </section>

      {/* Botón Final */}
      <section className="flex justify-end">
        <BtnLink
        link="/Vendedor/app/Productos"
        preventNavigation
        onClick={handleCrearProducto}
      >
        Crear   
      </BtnLink>
      </section>
    </div>
  );
};
