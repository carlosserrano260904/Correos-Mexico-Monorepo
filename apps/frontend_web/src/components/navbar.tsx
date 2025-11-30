// components/navbar.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {IoMenu, IoSearchOutline, IoMicOutline, IoAppsOutline, IoHeartOutline, IoHeartSharp, IoBagOutline, IoPersonOutline, IoTrashOutline} from "react-icons/io5";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useUser, useClerk } from '@clerk/nextjs'; 

const categories = ["Ropa", "Hogar", "Joyería y Bisutería", "Alimentos y Bebidas", "Belleza y Cuidado Personal", "Cocina", "Electronica", "Herramienta", "Artesanal"];

export const Navbar = () => {
    const router = useRouter();
    const { Favorites, removeFromFavorites, getTotalFavorites } = useFavorites();
    
    // Agregamos 'addToCart' para la funcionalidad de favoritos
    const { 
        items: cartItems, 
        removeFromCart, 
        addToCart,
        getTotalItems, 
        getTotalPrice 
    } = useCart();
    
    // Reemplazar useAuth con hooks de Clerk
    const { user, isLoaded: userLoaded } = useUser();
    const { signOut, openSignIn } = useClerk();
    
    const [isMounted, setIsMounted] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDropdownToggle = (dropdownName: string) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    const handleDropdownClose = () => {
        setOpenDropdown(null);
    };

    const formatPrice = (price: number) => {
        const safePrice = typeof price === 'number' ? price : 0;
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(safePrice);
    };

    const handleLoginClick = () => {
        openSignIn();
        handleDropdownClose();
    };

    const handleLogout = async () => {
        await signOut();
        handleDropdownClose();
    };

    // Función para manejar la búsqueda
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (searchTerm.trim()) {
            // Navegar a la página de resultados de búsqueda
            router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(""); // Limpiar el input después de buscar
            handleDropdownClose();
        }
    };

    // Función para búsqueda con Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

     // Variables de estado
    const totalFavorites = getTotalFavorites();
    const totalCartItems = getTotalItems();
    const cartSubtotal = getTotalPrice();
    const favoritesList = Favorites;
    const cartItemsList = cartItems;

    // Renderizar versión simplificada durante la hidratación
    if (!isMounted) {
        return (
            <div className="flex items-center justify-between w-full px-2 sm:px-3 md:px-4 py-2">
                 {/* Logo Placeholder */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <Image src="/logoCorreos.png" alt="Logo" width={70} height={26} className="w-12 h-4" />
                </div>
            </div>
        );  
    }

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md flex items-center justify-between w-full px-2 sm:px-3 md:px-4 py-2">
            {/* Logo */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                <Link href={'/'} className="flex items-center">
                    <Image
                        src="/logoCorreos.png"
                        alt="Logo de correos"
                        width={100}  
                        height={38}
                        priority
                        className="
                            h-9 w-auto object-contain
                            sm:h-10
                            md:h-11
                            lg:h-12
                            xl:h-14"
                    />
                </Link>
                
                 {/* Menú hamburguesa */}
                 <DropdownMenu open={openDropdown === 'menu'} onOpenChange={(open) => open ? handleDropdownToggle('menu') : handleDropdownClose()}>
                     <DropdownMenuTrigger className="flex items-center justify-center hover:bg-gray-100 rounded-full bg-[#F3F4F6] h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] md:h-[51px] md:w-[54px] flex-shrink-0">
                         <IoMenu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="start" className="w-[280px] sm:w-[300px] max-h-[400px] sm:max-h-[450px] overflow-y-auto">
                         {categories.map((category, index) => (
                             <DropdownMenuItem key={index} className="first:mb-4 sm:first:mb-6 last:mt-4 sm:last:mt-6 [&:not(:first-child):not(:last-child)]:my-4 sm:[&:not(:first-child):not(:last-child)]:my-6 text-sm sm:text-base">
                                 <Link href={`./categories?category=${encodeURIComponent(category)}`} onClick={handleDropdownClose} className="w-full">
                                     {category}
                                 </Link>
                             </DropdownMenuItem>
                         ))}
                     </DropdownMenuContent>
                 </DropdownMenu>
             </div>

            {/* Barra de búsqueda - Ocultar en móvil pequeño */}
            <div className="hidden sm:flex flex-1 w-full me-2 md:me-4 ms-1">
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoSearchOutline className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar un producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="block w-full pl-10 pr-3 py-2 rounded-4xl min-h-[40px] sm:min-h-[45px] md:min-h-[51px] bg-[#F3F4F6] placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-sm sm:text-base"
                    />
                    <button 
                        type="submit"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-full p-1 transition-colors"
                    >
                        <IoMicOutline className="w-4 h-4 sm:w-5 sm:h-5 stroke-[6] text-gray-500 hover:text-gray-700" />
                    </button>
                </form>
            </div>

            {/* Íconos de la derecha */}
            <div className="flex items-center gap-x-1 sm:gap-x-2">
                {/* Botón búsqueda móvil */}
                <DropdownMenu open={openDropdown === 'search'} onOpenChange={(open) => open ? handleDropdownToggle('search') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="sm:hidden p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[40px] min-w-[40px]">
                        <IoSearchOutline className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px] p-4">
                        <div className="flex-col">
                            <h3 className="text-lg font-semibold mb-3">Buscar productos</h3>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="¿Qué estás buscando?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                />
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-[#DE1484] text-white rounded-lg hover:bg-pink-700 transition-colors"
                                >
                                    <IoSearchOutline className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* App */}
                <DropdownMenu open={openDropdown === 'app'} onOpenChange={(open) => open ? handleDropdownToggle('app') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full text-gray-600 items-center gap-1 bg-[#F3F4F6] min-h-[40px] min-w-[40px] sm:min-h-[45px] sm:min-w-[45px] md:min-h-[51px] md:min-w-[54px]">
                        <IoAppsOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden lg:inline text-sm font-medium">App</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[280px] sm:w-[300px] p-3 sm:p-4">
                        <div className="flex-col">
                            <div className="text-lg sm:text-xl font-semibold text-center">Descárgalo en móvil</div>
                            <div className="text-black/50 text-xs sm:text-sm mt-1">Escanee con la cámara de su teléfono o la aplicación de código QR para descargarlo</div>
                        </div>
                        <div className="p-2 sm:p-3 mt-2">
                            <Image src={'/qr2.png'} alt="qr" width={150} height={150} className="w-full h-full max-w-[120px] sm:max-w-[150px] mx-auto" />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Favoritos */}
                <DropdownMenu open={openDropdown === 'favorites'} onOpenChange={(open) => open ? handleDropdownToggle('favorites') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[40px] min-w-[40px] sm:min-h-[45px] sm:min-w-[45px] md:min-h-[51px] md:min-w-[54px] relative">
                        <IoHeartOutline className={`w-4 h-4 sm:w-5 sm:h-5 ${totalFavorites > 0 ? 'hidden' : 'block'}`} />
                        <IoHeartSharp className={`w-4 h-4 sm:w-5 sm:h-5 text-red-600 ${totalFavorites > 0 ? 'block' : 'hidden'}`} />
                        <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center ${totalFavorites > 0 ? 'block' : 'hidden'}`}>
                            {totalFavorites}
                        </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[320px] sm:w-[350px] p-3 sm:p-4 max-h-[400px] overflow-y-auto">
                        <div className="flex-col">
                            {/* Header Nuevo */}
                            <div className="flex items-center pb-3 sm:pb-4 border-b-2 border-pink-300 border-dotted">
                                <div className="text-lg sm:text-xl font-semibold text-gray-800">
                                    Mis Favoritos
                                </div>
                                <Link href={"/favoritos"} className="ms-auto text-sm text-pink-500 hover:text-pink-800 transition-colors" onClick={handleDropdownClose}>
                                    Visualizar más
                                </Link>
                            </div>
                            
                            {favoritesList.length === 0 ? (
                                <div className="text-center py-6 sm:py-8 text-gray-500">
                                    <IoHeartOutline className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No tienes favoritos</p>
                                    <p className="text-xs">Agrega productos a tu lista</p>
                                </div>
                            ) : (
                                <div className="flex-col pt-3">
                                    {favoritesList.slice(0, 3).map((product, index) => (
                                        <div key={product.ProductID || index} className="flex items-start py-4 border-b border-dotted border-gray-300 last:border-b-0">
                                            {/* Imagen */}
                                            <div className="relative w-20 h-20 flex-shrink-0 mr-4 rounded-lg overflow-hidden border">
                                                <Image 
                                                    src={product.ProductImageUrl} 
                                                    alt={product.ProductName} 
                                                    fill
                                                    className="object-cover" 
                                                />
                                            </div>
                                            {/* Contenido */}
                                            <div className="flex flex-col flex-grow">
                                                <h3 className="text-sm sm:text-base font-normal text-gray-800 line-clamp-2">
                                                    {product.ProductName}
                                                </h3>
                                                <p className="text-lg font-bold text-gray-900 mt-1">
                                                    {formatPrice(product.productPrice)}
                                                </p>
                                                {/* Botones */}
                                                <div className="flex space-x-2 mt-2">
                                                    <button 
                                                        onClick={() => removeFromFavorites(product.ProductID)}
                                                        className="p-1 border border-gray-200 rounded-full text-pink-500 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                                                        title="Quitar de favoritos"
                                                    >
                                                        <IoTrashOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (addToCart) addToCart({ ...product, quantity: 1 }, 1);
                                                        }}
                                                        className="p-1 border border-gray-200 rounded-full text-gray-600 bg-white shadow-sm hover:shadow-md hover:bg-gray-100 transition-all duration-200"
                                                        title="Añadir al carrito"
                                                    >
                                                        <IoBagOutline className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {favoritesList.length > 3 && (
                                        <div className="text-center text-xs sm:text-sm text-gray-500 pt-4">
                                            Y {favoritesList.length - 3} productos más...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Carrito */}
                <DropdownMenu open={openDropdown === 'cart'} onOpenChange={(open) => open ? handleDropdownToggle('cart') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[40px] min-w-[40px] sm:min-h-[45px] sm:min-w-[45px] md:min-h-[51px] md:min-w-[54px] relative">
                        <IoBagOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                        {totalCartItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#DE1484] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {totalCartItems}
                            </span>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[340px] sm:w-[380px] p-3 sm:p-4 overflow-y-auto max-h-[400px] sm:max-h-[450px]">
                        <div className="flex-col">
                            {/* Header */}
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="text-base sm:text-lg font-semibold">Mi Carrito ({totalCartItems})</div>
                            </div>

                            <Separator className="mb-3 sm:mb-4" />

                            {cartItemsList.length === 0 ? (
                                <div className="text-center py-6 sm:py-8 text-gray-500">
                                    <IoBagOutline className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">Tu carrito está vacío</p>
                                    <p className="text-xs">Agrega productos para verlos aquí</p>
                                </div>
                            ) : (
                                <>
                                    {/* Items del carrito */}
                                    <div className="flex flex-col space-y-3 sm:space-y-4">
                                        {cartItemsList.slice(0, 3).map((item, index) => (
                                            <div key={item.ProductID ? `cart-${item.ProductID}` : `cart-${index}`} className="flex items-stretch">
                                                {/* Imagen */}
                                                <div className="basis-1/4 relative h-14 sm:h-16">
                                                    <Image 
                                                        src={item.ProductImageUrl} 
                                                        alt={item.ProductName} 
                                                        fill
                                                        className="rounded-lg object-cover" 
                                                    />
                                                </div>

                                                {/* Detalles */}
                                                <div className="basis-2/3 ms-2 sm:ms-3 flex flex-col justify-between text-xs sm:text-sm">
                                                    <div className="font-medium line-clamp-2">{item.ProductName}</div>
                                                    <div className="font-semibold">{formatPrice(item.productPrice)}</div>
                                                    
                                                    {/* Controles de Cantidad y Color */}
                                                    <div className="flex items-center mt-1 sm:mt-2">
                                                        {/* Selector estilo Pill */}
                                                        <div className="flex items-center justify-between border-2 border-pink-400 rounded-full w-[90px] px-2 py-0.5 bg-white select-none">
                                                            <button 
                                                                className="text-lg font-bold text-gray-800 hover:text-yellow-600 leading-none pb-0.5 px-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (item.quantity && item.quantity > 1) {
                                                                        if (addToCart) {
                                                                            addToCart(item, -1);
                                                                        }
                                                                    } else {
                                                                        removeFromCart(item.ProductID);
                                                                    }
                                                                }}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-sm font-bold text-gray-900 mx-1">
                                                                {item.quantity}
                                                            </span>
                                                            <button 
                                                                className="text-lg font-bold text-gray-800 hover:text-yellow-600 leading-none pb-0.5 px-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (addToCart) addToCart({ ...item, quantity: 1 }, 1);
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* Color Indicator */}
                                                        {item.selectedColor && (
                                                            <div 
                                                                className="w-4 h-4 rounded-full border border-gray-300 ms-3 shadow-sm flex-shrink-0"
                                                                style={{ backgroundColor: item.selectedColor }}
                                                                title={`Color: ${item.selectedColor}`}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Eliminar */}
                                                <div className="basis-1/12 flex items-center justify-center">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFromCart(item.ProductID);
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded text-red-500 transition-colors"
                                                        title="Eliminar producto"
                                                    >
                                                        <IoTrashOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {cartItemsList.length > 3 && (
                                            <div className="text-center text-xs sm:text-sm text-gray-500 pt-2">
                                                Y {cartItemsList.length - 3} productos más...
                                            </div>
                                        )}
                                    </div>

                                    {/* Subtotal */}
                                    <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                                        <span className="font-semibold text-sm sm:text-base">Subtotal:</span>
                                        <span className="font-bold text-base sm:text-lg">
                                            {formatPrice(cartSubtotal)}
                                        </span>
                                    </div>

                                    {/* Botón Carrito */}
                                    <div className="mt-3 sm:mt-4">
                                        <Link 
                                            href="/Carrito" 
                                            className="w-full bg-[#DE1484] hover:bg-pink-700 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors flex items-center justify-center"
                                            onClick={handleDropdownClose}
                                        >
                                            Ver Carrito Completo
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Usuario - CORREGIDO CON CLERK */}
                <DropdownMenu open={openDropdown === 'user'} onOpenChange={(open) => open ? handleDropdownToggle('user') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[40px] min-w-[40px] sm:min-h-[45px] sm:min-w-[45px] md:min-h-[51px] md:min-w-[54px]">
                        {!userLoaded ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                            <IoPersonOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-[260px] sm:w-[280px] p-3 sm:p-4">
                        {!user ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 text-center">Iniciar Sesión</h3>
                                <div className="text-center space-y-3">
                                    <button 
                                        onClick={handleLoginClick}
                                        className="w-full bg-[#DE1484] hover:bg-pink-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <Link 
                                        href="/registro"
                                        onClick={handleDropdownClose}
                                        className="text-[#DE1484] hover:text-pink-700 text-xs font-medium transition-colors block"
                                    >
                                        ¿No tienes cuenta? Regístrate
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-col">
                                <div className="flex items-center mb-3 sm:mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DE1484] rounded-full flex items-center justify-center text-white font-medium mr-2 sm:mr-3 text-sm">
                                        {user.firstName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-col">
                                        <div className="font-semibold text-sm sm:text-base">
                                            {user.fullName || user.username || 'Usuario'}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            {user.primaryEmailAddress?.emailAddress || 'user@example.com'}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="mb-3 sm:mb-4" />

                                <div className="flex flex-col space-y-2 sm:space-y-3">
                                    <Link 
                                            href="/Perfil" 
                                            onClick={handleDropdownClose} 
                                            className="text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Mi Perfil
                                        </Link>
                                    
                                    <Link href="/historial" onClick={handleDropdownClose} className="text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base flex items-center gap-2 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Historial de Compras
                                    </Link>
                                    
                                    <Link href="/solicitar_cuenta" onClick={handleDropdownClose} className="text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base flex items-center gap-2 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Ser Vendedor
                                    </Link>
                                    
                                    {user.publicMetadata?.role === 'vendor' && (
                                        <Link href="/vendedor/app" onClick={handleDropdownClose} className="text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base flex items-center gap-2 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Panel Vendedor
                                        </Link>
                                    )}
                                </div>

                                <Separator className="my-3 sm:my-4" />

                                <button onClick={handleLogout} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* ---------------- SELECTOR IDIOMA ---------------- */}
                <DropdownMenu open={openDropdown === 'language'} onOpenChange={(open) => open ? handleDropdownToggle('language') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="hidden sm:flex p-2 items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[40px] min-w-[40px] sm:min-h-[45px] sm:min-w-[45px] md:min-h-[51px] md:min-w-[54px]">
                        <span className="text-xs sm:text-sm font-medium">ES</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[260px] sm:w-[280px] p-2">
                        <div className="flex-col">
                            {/* Español */}
                            <div className="flex items-center justify-between px-2 sm:px-3 py-2 sm:py-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={handleDropdownClose}>
                                <div className="flex items-center">
                                    <div className="w-6 h-5 sm:w-8 sm:h-6 mr-2 sm:mr-3 flex items-center justify-center text-base sm:text-lg">🇲🇽</div>
                                    <span className="text-xs sm:text-sm font-medium">Español (México)</span>
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-gray-600">ES</span>
                            </div>
                            <Separator className="my-1" />
                            {/* Inglés */}
                            <div className="flex items-center justify-between px-2 sm:px-3 py-2 sm:py-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={handleDropdownClose}>
                                <div className="flex items-center">
                                    <div className="w-6 h-5 sm:w-8 sm:h-6 mr-2 sm:mr-3 flex items-center justify-center text-base sm:text-lg">🇺🇸</div>
                                    <span className="text-xs sm:text-sm font-medium">Inglés (EE.UU.)</span>
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-gray-600">EN</span>
                            </div>
                            <Separator className="my-1" />
                            {/* Francés */}
                            <div className="flex items-center justify-between px-2 sm:px-3 py-2 sm:py-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={handleDropdownClose}>
                                <div className="flex items-center">
                                    <div className="w-6 h-5 sm:w-8 sm:h-6 mr-2 sm:mr-3 flex items-center justify-center text-base sm:text-lg">🇫🇷</div>
                                    <span className="text-xs sm:text-sm font-medium">Francés (Francia)</span>
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-gray-600">FR</span>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};