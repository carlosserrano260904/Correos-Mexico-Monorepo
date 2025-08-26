import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    IoMenu,
    IoSearchOutline,
    IoMicOutline,
    IoAppsOutline,
    IoHeartOutline,
    IoHeartSharp,
    IoBagOutline,
    IoPersonOutline,
    IoTrashOutline,
    IoLogOutOutline
} from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProduct";
import { useNavbar } from "@/hooks/useNavbar";

export const Navbar = () => {
    const { Favorites, removeFromFavorites, getTotalFavorites } = useFavorites();
    const { CartItems, removeFromCart, getTotalItems, getSubtotal } = useCart();
    const { getAvailableCategories, getProductCountByCategory, searchProducts, loading: productsLoading } = useProducts();
    const auth = useAuth();
    const navbar = useNavbar();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = React.useRef<HTMLDivElement>(null);

    // Función para manejar el acceso a favoritos
    const handleFavoritesAccess = () => {
        if (!auth.isAuthenticated) {
            router.push('/login?redirect=/favoritos');
            return;
        }
        // Si está autenticado, continúa con el comportamiento normal del dropdown
    };

    // Función para manejar el acceso al carrito
    const handleCartAccess = () => {
        if (!auth.isAuthenticated) {
            router.push('/login?redirect=/Carrito');
            return;
        }
        // Si está autenticado, continúa con el comportamiento normal del dropdown
    };

    // Función para manejar la búsqueda
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Resultados de búsqueda en tiempo real (limitados)
    const searchResults = React.useMemo(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) return [];
        return searchProducts(searchQuery).slice(0, 5); // Solo mostrar primeros 5 resultados
    }, [searchQuery, searchProducts]);

    // Marcar como montado solo en el cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mostrar sugerencias cuando hay query
    useEffect(() => {
        setShowSearchResults(searchQuery.length >= 2);
    }, [searchQuery]);


    // ✅ Memoizar datos ANTES de cualquier return condicional
    const totalFavorites = React.useMemo(() => getTotalFavorites(), [Favorites]);
    const totalCartItems = React.useMemo(() => getTotalItems(), [CartItems]);
    const cartSubtotal = React.useMemo(() => getSubtotal(), [CartItems]);
    const favoritesList = React.useMemo(() => Favorites, [Favorites]);
    const cartItemsList = React.useMemo(() => CartItems, [CartItems]);
    
    // ✅ Obtener categorías dinámicas de la API
    const categories = React.useMemo(() => {
        const availableCategories = getAvailableCategories();
        return availableCategories.length > 0 
            ? availableCategories 
            : ["Ropa", "Hogar", "Joyería y Bisutería", "Alimentos y Bebidas", "Belleza y Cuidado Personal", "Cocina", "Electronica", "Herramienta", "Artesanal"]; // Fallback
    }, [getAvailableCategories]);


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(price);
    };

    // Renderizar versión simplificada durante la hidratación
    if (!isMounted) {
        return (
            <div className="flex items-center justify-between w-full px-4 py-2">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link href={'/'}>
                        <Image
                            src="/logoCorreos.png"
                            alt="Logo de correos"
                            width={100}
                            height={38}
                        />
                    </Link>
                    <div className="flex items-center justify-center hover:bg-gray-100 rounded-full bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoMenu className="w-5 h-5 text-gray-600" />
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="flex-1 w-full me-4 ms-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IoSearchOutline className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar un producto..."
                            className="block w-full pl-10 pr-3 py-2 rounded-4xl min-h-[51px] bg-[#F3F4F6] placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <IoMicOutline className="w-5 h-5 stroke-[6]" />
                        </div>
                    </div>
                </div>

                {/* Íconos simplificados */}
                <div className="flex items-center gap-x-2">
                    <div className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center gap-1 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoAppsOutline className="w-5 h-5" />
                        <span className="text-sm font-medium">App</span>
                    </div>
                    {/* Favoritos - siempre botón simple durante hidratación */}
                    <div className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoHeartOutline className="w-5 h-5" />
                    </div>
                    {/* Carrito - siempre botón simple durante hidratación */}
                    <div className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoBagOutline className="w-5 h-5" />
                    </div>
                    <div className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoPersonOutline className="w-5 h-5" />
                    </div>
                    <div className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <span className="text-sm font-medium">ES</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md flex items-center justify-between w-full px-4 py-2">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <Link href={'/'}>
                    <Image
                        src="/logoCorreos.png"
                        alt="Logo de correos"
                        width={100}
                        height={38}
                    />
                </Link>
                {/* Menú hamburguesa */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-center hover:bg-gray-100 rounded-full bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoMenu className="w-5 h-5 text-gray-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[350px] max-h-[450px] overflow-y-auto">
                        {productsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                <span className="ml-2 text-sm text-gray-600">Cargando categorías...</span>
                            </div>
                        ) : categories.length > 0 ? (
                            <>
                                <div className="px-3 py-2 text-sm font-semibold text-gray-700 border-b">
                                    Categorías Disponibles ({categories.length})
                                </div>
                                {categories.map((category, index) => {
                                    const productCount = getProductCountByCategory(category);
                                    return (
                                        <DropdownMenuItem key={category} className="p-0">
                                            <Link 
                                                href={`./categories?category=${encodeURIComponent(category)}`}
                                                className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium">{category}</span>
                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {productCount}
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )
                                })}
                                {categories.length === 0 && (
                                    <div className="px-3 py-4 text-center text-gray-500">
                                        <div className="text-sm">No hay productos disponibles</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="px-3 py-4 text-center text-gray-500">
                                <div className="text-sm">No hay categorías disponibles</div>
                                <div className="text-xs text-gray-400 mt-1">Los productos se están cargando...</div>
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Barra de búsqueda */}
            <div ref={searchRef} className="flex-1 w-full me-4 ms-1 relative">
                <form onSubmit={handleSearch} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoSearchOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar un producto..."
                        className="block w-full pl-10 pr-12 py-2 rounded-4xl min-h-[51px] bg-[#F3F4F6] placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-pink-500 transition-colors"
                    >
                        <IoMicOutline className="w-5 h-5" />
                    </button>
                </form>
                
                {/* Dropdown de sugerencias de búsqueda */}
                {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                        <div className="p-2 border-b bg-gray-50">
                            <span className="text-xs font-medium text-gray-600">Productos encontrados ({searchResults.length})</span>
                        </div>
                        {searchResults.map((product) => (
                            <Link
                                key={product.ProductID}
                                href={`/producto/${product.ProductID}`}
                                className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                onClick={() => {
                                    setSearchQuery("");
                                    setShowSearchResults(false);
                                }} // Limpiar búsqueda al hacer clic
                            >
                                <img
                                    src={product.ProductImageUrl}
                                    alt={product.ProductName}
                                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {product.ProductName}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {product.ProductCategory} • {formatPrice(product.productPrice)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                        <div className="p-2 bg-gray-50 border-t">
                            <button
                                onClick={handleSearch}
                                className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                            >
                                Ver todos los resultados →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Íconos de la derecha */}
            <div className="flex items-center gap-x-2">
                {/* App */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center gap-1 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoAppsOutline className="w-5 h-5" />
                        <span className="text-sm font-medium">App</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px] p-4">
                        <div className="flex-col">
                            <div className="text-xl font-semibold text-center">Descárgalo en móvil</div>
                            <div className="text-black/50 text-sm">Escanee con la cámara de su teléfono o la aplicación de código QR para descargarlo</div>
                        </div>
                        <div className="p-3">
                            <Image src={'/qr2.png'} alt="qr" width={150} height={150} className="w-full h-full" />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Favoritos */}
                {auth.isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px] relative">
                            <IoHeartOutline className={`w-5 h-5 ${totalFavorites > 0 ? 'hidden' : 'block'}`} />
                            <IoHeartSharp className={`w-5 h-5 text-red-600 ${totalFavorites > 0 ? 'block' : 'hidden'}`} />
                            <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${totalFavorites > 0 ? 'block' : 'hidden'}`}>
                                {totalFavorites}
                            </span>
                        </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[350px] p-4 overflow-y-auto max-h-[400px]">
                        <div className="flex-col">
                            <div className="flex items-center">
                                <div className="text-lg font-semibold">Mis Favoritos ({totalFavorites})</div>
                                <Link href={"/favoritos"} className="ms-auto text-sm underline">
                                    Visualizar mis favoritos
                                </Link>
                            </div>
                            <Separator className="my-3" />
                            
                            {favoritesList.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <IoHeartOutline className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No tienes favoritos</p>
                                    <p className="text-sm">Agrega productos a tu lista de favoritos</p>
                                </div>
                            ) : (
                                <div className="flex-col space-y-3">
                                    {favoritesList.slice(0, 3).map((product) => (
                                        <div key={product.ProductID} className="flex items-stretch">
                                            <div className="basis-1/3">
                                                <img 
                                                    src={product.ProductImageUrl} 
                                                    alt={product.ProductName} 
                                                    width={100} 
                                                    height={100} 
                                                    className="w-full h-full rounded-2xl object-cover" 
                                                />
                                            </div>
                                            <div className="basis-2/3 ms-2 flex flex-col justify-between text-sm">
                                                <div className="font-semibold line-clamp-2">{product.ProductName}</div>
                                                <div className="text-gray-500">{product.ProductBrand}</div>
                                                <div className="font-bold">{formatPrice(product.productPrice)}</div>
                                            </div>
                                            <div className="basis-1/12 flex items-center justify-center">
                                                <button 
                                                    onClick={() => removeFromFavorites(product.ProductID)}
                                                    className="p-1 hover:bg-gray-100 rounded text-red-500"
                                                >
                                                    <IoTrashOutline className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {favoritesList.length > 3 && (
                                        <div className="text-center text-sm text-gray-500 pt-2">
                                            Y {favoritesList.length - 3} productos más...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    // Botón de favoritos para usuarios no autenticados
                    <button 
                        onClick={handleFavoritesAccess}
                        className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px] relative"
                    >
                        <IoHeartOutline className="w-5 h-5" />
                    </button>
                )}

                {/* Carrito */}
                {auth.isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px] relative">
                            <IoBagOutline className="w-5 h-5" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#DE1484] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[380px] p-4 overflow-y-auto max-h-[450px]">
                        <div className="flex-col">
                            {/* Header */}
                            <div className="flex items-center mb-4">
                                <div className="text-lg font-semibold">Mi Carrito ({getTotalItems()})</div>
                                <Link href={"/Carrito"} className="ms-auto text-sm underline">
                                    Visualizar más
                                </Link>
                            </div>

                            <Separator className="mb-4" />

                            {CartItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <IoBagOutline className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Tu carrito está vacío</p>
                                    <p className="text-sm">Agrega productos para verlos aquí</p>
                                </div>
                            ) : (
                                <>
                                    {/* Items del carrito */}
                                    <div className="flex flex-col space-y-4">
                                        {CartItems.slice(0, 3).map((item) => (
                                            <div key={item.ProductID} className="flex items-stretch">
                                                <div className="basis-1/4">
                                                    {item.ProductImageUrl ? (
                                                        <img 
                                                            src={item.ProductImageUrl} 
                                                            alt={item.ProductName} 
                                                            width={60} 
                                                            height={60} 
                                                            className="w-full h-full rounded-lg object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-400 text-xs">Sin imagen</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="basis-2/3 ms-3 flex flex-col justify-between text-sm">
                                                    <div className="font-medium line-clamp-2">{item.ProductName}</div>
                                                    <div className="font-semibold">{formatPrice(item.productPrice)}</div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500">Cantidad: {item.prodcutQuantity}</span>
                                                        <div className={`w-3 h-3 rounded-full ${item.isSelected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    </div>
                                                </div>
                                                <div className="basis-1/12 flex items-center justify-center">
                                                    <button 
                                                        onClick={() => removeFromCart(item.ProductID)}
                                                        className="p-1 hover:bg-gray-100 rounded text-red-500"
                                                    >
                                                        <IoTrashOutline className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {CartItems.length > 3 && (
                                            <div className="text-center text-sm text-gray-500 pt-2">
                                                Y {CartItems.length - 3} productos más...
                                            </div>
                                        )}
                                    </div>

                                    {/* Subtotal */}
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                        <span className="font-semibold">Subtotal:</span>
                                        <span className="font-bold text-lg">{formatPrice(getSubtotal())}</span>
                                    </div>

                                    {/* Botón Comprar ahora */}
                                    <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-full mt-4 transition-colors">
                                        <Link href={"/pago/"}>
                                            Comprar ahora
                                        </Link>
                                    </button>
                                </>
                            )}
                        </div>
                    </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    // Botón de carrito para usuarios no autenticados
                    <button 
                        onClick={handleCartAccess}
                        className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px] relative"
                    >
                        <IoBagOutline className="w-5 h-5" />
                    </button>
                )}

                {/* Usuario - Mostrar según estado de autenticación */}
                {auth.loading ? (
                    <div className="p-2 flex items-center justify-center rounded-full text-gray-400 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <div className="animate-spin">
                            <IoPersonOutline className="w-5 h-5" />
                        </div>
                    </div>
                ) : auth.isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                            {navbar.avatarUrl && navbar.avatarUrl !== 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg' ? (
                                <img 
                                    src={navbar.avatarUrl} 
                                    alt="Avatar" 
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            ) : (
                                <IoPersonOutline className="w-5 h-5" />
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[280px] p-4">
                            <div className="flex-col">
                                {/* Header con info del usuario */}
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-[#DE1484] rounded-full flex items-center justify-center text-white font-medium mr-3">
                                        {navbar.avatarUrl && navbar.avatarUrl !== 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg' ? (
                                            <img 
                                                src={navbar.avatarUrl} 
                                                alt="Avatar" 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg">
                                                {navbar.getInitials()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-col">
                                        <div className="font-semibold text-base" title={`Nombre completo: ${navbar.displayName}`}>
                                            {navbar.displayName}
                                        </div>
                                        <div className="text-sm text-gray-500" title={`Teléfono: ${navbar.displayPhone}`}>
                                            {navbar.displayPhone}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="mb-4" />

                                {/* Opciones del menú */}
                                <div className="flex flex-col space-y-3">
                                    <Link href="/Perfil" className="text-gray-700 hover:text-gray-900 font-medium">
                                        Mi Perfil
                                    </Link>
                                    <Link href="/historial" className="text-gray-700 hover:text-gray-900 font-medium">
                                        Historial de Pedidos
                                    </Link>
                                    <Link href="/favoritos" className="text-gray-700 hover:text-gray-900 font-medium">
                                        Mis Favoritos
                                    </Link>
                                    <Link href="/solicitar_cuenta" className="text-gray-700 hover:text-gray-900 font-medium">
                                        Solicitar Cuenta de Vendedor
                                    </Link>
                                    <Link href="/Vendedor/app" className="text-gray-700 hover:text-gray-900 font-medium">
                                        Panel de Vendedor
                                    </Link>
                                </div>

                                <Separator className="my-4" />

                                {/* Botón cerrar sesión */}
                                <button 
                                    onClick={() => {
                                        auth.logout();
                                        window.location.href = '/';
                                    }}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <IoLogOutOutline className="w-4 h-4" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    /* Auth buttons for non-authenticated users */
                    <div className="flex items-center gap-2">
                        <Link 
                            href="/login" 
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors min-h-[45px] flex items-center justify-center"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link 
                            href="/registro" 
                            className="px-4 py-2 text-sm font-medium text-white bg-[#DE1484] hover:bg-pink-600 rounded-full transition-colors min-h-[45px] flex items-center justify-center"
                        >
                            Registrarse
                        </Link>
                    </div>
                )}

                {/* Selector de idioma */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <span className="text-sm font-medium">ES</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[280px] p-2">
                        <div className="flex-col">
                            {/* Español */}
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <div className="flex items-center">
                                    <div className="w-8 h-6 mr-3 flex items-center justify-center text-lg">
                                        🇲🇽
                                    </div>
                                    <span className="text-sm font-medium">Español (México)</span>
                                </div>
                                <span className="text-sm font-bold text-gray-600">ES</span>
                            </div>

                            <Separator className="my-1" />

                            {/* Inglés */}
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <div className="flex items-center">
                                    <div className="w-8 h-6 mr-3 flex items-center justify-center text-lg">
                                        🇺🇸
                                    </div>
                                    <span className="text-sm font-medium">Inglés (EE.UU.)</span>
                                </div>
                                <span className="text-sm font-bold text-gray-600">EN</span>
                            </div>

                            <Separator className="my-1" />

                            {/* Francés */}
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <div className="flex items-center">
                                    <div className="w-8 h-6 mr-3 flex items-center justify-center text-lg">
                                        🇫🇷
                                    </div>
                                    <span className="text-sm font-medium">Francés (Francia)</span>
                                </div>
                                <span className="text-sm font-bold text-gray-600">FR</span>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}