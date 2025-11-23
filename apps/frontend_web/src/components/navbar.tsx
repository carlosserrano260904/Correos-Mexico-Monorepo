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
    IoTrashOutline
} from "react-icons/io5";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";

const categories = ["Ropa", "Hogar", "Joyería y Bisutería", "Alimentos y Bebidas", "Belleza y Cuidado Personal", "Cocina", "Electronica", "Herramienta", "Artesanal"];

export const Navbar = () => {
    const { Favorites, removeFromFavorites, getTotalFavorites } = useFavorites();
    const { CartItems, removeFromCart, getTotalItems, getSubtotal } = useCart();
    const [isMounted, setIsMounted] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
                    <div className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoHeartOutline className="w-5 h-5" />
                    </div>
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

    // Solo obtener datos después del montaje
    const totalFavorites = getTotalFavorites();
    const totalCartItems = getTotalItems();
    const cartSubtotal = getSubtotal();
    const favoritesList = Favorites;
    const cartItemsList = CartItems;

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
                <DropdownMenu open={openDropdown === 'menu'} onOpenChange={(open) => open ? handleDropdownToggle('menu') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="flex items-center justify-center hover:bg-gray-100 rounded-full bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoMenu className="w-5 h-5 text-gray-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[300px] max-h-[450px] overflow-y-auto">
                        {categories.map((category, index) => (
                            <DropdownMenuItem key={index} className="first:mb-6 last:mt-6 [&:not(:first-child):not(:last-child)]:my-6">
                                <Link href={`./categories?category=${encodeURIComponent(category)}`} onClick={handleDropdownClose}>
                                    {category}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
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

            {/* Íconos de la derecha */}
            <div className="flex items-center gap-x-2">
                {/* App */}
                <DropdownMenu open={openDropdown === 'app'} onOpenChange={(open) => open ? handleDropdownToggle('app') : handleDropdownClose()}>
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
                <DropdownMenu open={openDropdown === 'favorites'} onOpenChange={(open) => open ? handleDropdownToggle('favorites') : handleDropdownClose()}>
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
                                <Link href={"/favoritos"} className="ms-auto text-sm underline" onClick={handleDropdownClose}>
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
                                                    onClick={() => {
                                                        removeFromFavorites(product.ProductID);
                                                        handleDropdownClose();
                                                    }}
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

                {/* Carrito */}
                <DropdownMenu open={openDropdown === 'cart'} onOpenChange={(open) => open ? handleDropdownToggle('cart') : handleDropdownClose()}>
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
                                <Link href={"/Carrito"} className="ms-auto text-sm underline" onClick={handleDropdownClose}>
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
                                                    <img 
                                                        src={item.ProductImageUrl} 
                                                        alt={item.ProductName} 
                                                        width={60} 
                                                        height={60} 
                                                        className="w-full h-full rounded-lg object-cover" 
                                                    />
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
                                                        onClick={() => {
                                                            removeFromCart(item.ProductID);
                                                            handleDropdownClose();
                                                        }}
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
                                    <button 
                                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-full mt-4 transition-colors"
                                        onClick={handleDropdownClose}
                                    >
                                        <Link href={"/pago/"}>
                                            Comprar ahora
                                        </Link>
                                    </button>
                                </>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Usuario */}
                <DropdownMenu open={openDropdown === 'user'} onOpenChange={(open) => open ? handleDropdownToggle('user') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <IoPersonOutline className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[280px] p-4">
                        <div className="flex-col">
                            {/* Header con info del usuario */}
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium mr-3">
                                    JD
                                </div>
                                <div className="flex-col">
                                    <div className="font-semibold text-base">Mayela Díaz</div>
                                    <div className="text-sm text-gray-500">Mayela@gmail.com</div>
                                </div>
                            </div>

                            <Separator className="mb-4" />

                            {/* Opciones del menú */}
                            <div className="flex flex-col space-y-3">
                                <Link href="/Perfil" className="text-gray-700 hover:text-gray-900 font-medium" onClick={handleDropdownClose}>
                                    Mi Perfil
                                </Link>
                                <Link href="/historial" className="text-gray-700 hover:text-gray-900 font-medium" onClick={handleDropdownClose}>
                                    Historial
                                </Link>
                                <Link href="/solicitar_cuenta" className="text-gray-700 hover:text-gray-900 font-medium" onClick={handleDropdownClose}>
                                    Solicitar Cuenta de Vendedor
                                </Link>
                                <Link href="/Vendedor/app" className="text-gray-700 hover:text-gray-900 font-medium" onClick={handleDropdownClose}>
                                    Vendedor
                                </Link>
                            </div>

                            <Separator className="my-4" />

                            {/* Botón cerrar sesión */}
                            <button 
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                                onClick={handleDropdownClose}
                            >
                                <Link href={"/"}>
                                    Cerrar sesión
                                </Link>
                            </button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Selector de idioma */}
                <DropdownMenu open={openDropdown === 'language'} onOpenChange={(open) => open ? handleDropdownToggle('language') : handleDropdownClose()}>
                    <DropdownMenuTrigger className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 bg-[#F3F4F6] min-h-[51px] min-w-[54px]">
                        <span className="text-sm font-medium">ES</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[280px] p-2">
                        <div className="flex-col">
                            {/* Español */}
                            <div 
                                className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                onClick={handleDropdownClose}
                            >
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
                            <div 
                                className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                onClick={handleDropdownClose}
                            >
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
                            <div 
                                className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                onClick={handleDropdownClose}
                            >
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