'use client'
import { useProducts } from "@/hooks/useProduct";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useLists } from "@/hooks/useLists";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plantilla } from "@/components/plantilla";
import { CarrouselProducts } from "@/components/CarouselProducts";
import { CommentsSection } from "@/components/CommentsSection";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ProductDetailPage() {
  const { selectedProduct, hasSelectedProduct, Products } = useProducts();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { Lists, createList, addProductToList } = useLists();
  const router = useRouter();
  
  // Estados para la selección
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedTalla, setSelectedTalla] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  
  // Estados para modal de listas
  const [showListModal, setShowListModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  useEffect(() => {
    // Si no hay producto seleccionado, redirigir al inicio
    if (!hasSelectedProduct()) {
      router.push('/');
    }
  }, [hasSelectedProduct, router]);

  // Si no hay producto seleccionado, mostrar loading
  if (!selectedProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Cargando producto...</div>
      </div>
    );
  }

  const isProductFavorite = isFavorite(selectedProduct.ProductID);

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(selectedProduct.productPrice);

  const Variants: string[] = selectedProduct.variants.map(variant => variant.valor)
  const Colors: string[] = Variants.filter(function(color){
    return color.includes('#')
  })

  const tallas = Variants.filter(function(talla) {
    return talla.includes("G") || talla.includes("M") || talla.includes("CH");
  });

  // Función para agregar al carrito
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    // Validaciones opcionales
    if (Colors.length > 0 && !selectedColor) {
      return;
    }
    
    if (tallas.length > 0 && !selectedTalla) {
      return;
    }

    // Agregar al carrito
    addToCart(selectedProduct, cantidad);
  };

  // Función para manejar favoritos
  const handleToggleFavorite = () => {
    if (!selectedProduct) return;
    
    if (isProductFavorite) {
      removeFromFavorites(selectedProduct.ProductID);
    } else {
      addToFavorites(selectedProduct);
    }
  };

  // Función para agregar a lista
  const handleAddToList = () => {
    if (!selectedProduct) return;

    if (selectedListId) {
      // Agregar a lista existente
      addProductToList(selectedListId, selectedProduct);
    } else if (newListName.trim()) {
      // Crear nueva lista y agregar producto
      createList(newListName.trim());
      // Obtener la lista recién creada (será la última)
      const newListId = Lists.length > 0 ? Math.max(...Lists.map(l => l.ListaID)) + 1 : 1;
      setTimeout(() => {
        addProductToList(newListId, selectedProduct);
      }, 100);
    }
    
    setNewListName("");
    setSelectedListId(null);
    setShowListModal(false);
  };

  return (
    <Plantilla>
      <div className="">
        <div className="flex">
          <div className=" rounded-2xl p-8 basis-2/3">
            <img src={selectedProduct.ProductImageUrl} className="max-w-96" />
          </div>
          <div className="basis-1/3">
            <p className="text-xl  mb-2">{selectedProduct.ProductName}</p>
            <p className="my-6 text-3xl font-bold">{formattedPrice}</p>
            
            {/* Selección de colores */}
            {Colors.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 font-thin text-[#FF6FBF]">Selecciona un color:</p>
                <div className="flex">
                  {Colors.map(color => (
                    <div 
                      key={color} 
                      className={`h-8 w-8 rounded-full mr-2 cursor-pointer border-2 ${
                        selectedColor === color ? 'border-[#FF57CF]' : 'border-gray-300'
                      }`}
                      style={{backgroundColor: color}}
                      onClick={() => setSelectedColor(color)}
                      title={`Seleccionar color ${color}`}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600 mt-1">Color seleccionado: {selectedColor}</p>
                )}
              </div>
            )}

            {/* Selección de tallas */}
            {tallas.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 font-thin text-[#FF6FBF]">Selecciona una talla:</p>
                <div className="flex">
                  {tallas.map(talla => (
                    <div 
                      key={talla} 
                      className={`h-10 w-10 border rounded-full justify-items-center content-center mr-2 cursor-pointer ${
                        selectedTalla === talla 
                          ? 'bg-[#DE1484] text-white border-[#DE1484]' 
                          : 'bg-[#f5f5f5] border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedTalla(talla)}
                    >
                      <p className="text-sm">{talla}</p>
                    </div>
                  ))}
                </div>
                {selectedTalla && (
                  <p className="text-sm text-gray-600 mt-1">Talla seleccionada: {selectedTalla}</p>
                )}
              </div>
            )}

            {/* Input de cantidad */}
            <div className="mb-6">
              <p className="mb-2 font-medium">Cantidad:</p>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botón Agregar al Carrito */}
            <div className="mb-4">
              <button
                onClick={handleAddToCart}
                className="w-2/3 bg-[#DE1484] text-white py-3 px-6 rounded-full hover:bg-[#c41374] transition-colors font-medium"
              >
                Agregar al Carrito
              </button>
            </div>
            
            {/* Botones de Favoritos y Listas */}
            <div className="flex justify-end gap-3">
              {/* Botón Favoritos */}
              <button
                onClick={handleToggleFavorite}
                className="bg-gray-100 text-black py-3 px-3 rounded-full hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                title={isProductFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {isProductFavorite ? 
                  <IoHeartSharp className="w-5 h-5 text-red-600" /> : 
                  <IoHeartOutline className="w-5 h-5"/>
                }
              </button>

              {/* Botón Agregar a Lista */}
              <AlertDialog open={showListModal} onOpenChange={setShowListModal}>
                <AlertDialogTrigger asChild>
                  <button
                    className="bg-gray-100 text-black py-3 px-3 rounded-full hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                    title="Agregar a lista"
                  >
                    <span className="text-lg">📝</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Agregar "{selectedProduct.ProductName}" a lista</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="space-y-4">
                    {Lists.length > 0 && (
                      <div>
                        <p className="text-gray-700 text-sm mb-2">Listas existentes:</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {Lists.map((lista) => (
                            <div
                              key={lista.ListaID}
                              className={`border px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                selectedListId === lista.ListaID
                                  ? 'border-pink-500 bg-pink-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedListId(
                                selectedListId === lista.ListaID ? null : lista.ListaID
                              )}
                            >
                              <p className="text-sm font-medium">{lista.ListaName}</p>
                              <p className="text-xs text-gray-500">
                                {lista.ListaProducts.length} productos
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        O crear nueva lista:
                      </label>
                      <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Lista para navidad"
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel 
                      onClick={() => {
                        setNewListName("");
                        setSelectedListId(null);
                      }}
                      className="rounded-lg"
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAddToList}
                      disabled={!selectedListId && !newListName.trim()}
                      className="bg-pink-600 hover:bg-pink-500 text-white rounded-lg disabled:opacity-50"
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        
        <div className="border p-8 mt-8 flex rounded-xl">
          <div className="basis-1/2">
            <p className="mb-4 font-bold text-2xl ">Descubre mas...</p>
            {selectedProduct.ProductDescription}
          </div>
          <div className="basis-1/2 justify-center flex ">
            <img src={selectedProduct.ProductImageUrl} className=" max-h-80" />
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="mt-12">
          <CommentsSection productId={selectedProduct.ProductID.toString()} />
        </div>
      </div>
      <CarrouselProducts entradas={Products} title="Mas Productos"></CarrouselProducts>
    </Plantilla>
  );
}