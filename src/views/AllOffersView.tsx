import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { getProductsWithOffers } from "../services/productOffersService";
import { getCategories } from '../services/productService';
import HomeHeader from '../components/home/HomeHeader';
import { HomeFooter } from '../components/home/HomeFooter';

// Hook para extraer colores dominantes de una imagen
const useImageColors = (imageUrl: string) => {
    const [colors, setColors] = useState<{ primary: string; secondary: string } | null>(null);

    useEffect(() => {
        if (!imageUrl) return;

        const extractColors = async () => {
            try {
                const img = new Image();
                
                const loadImage = () => new Promise<HTMLImageElement>((resolve, reject) => {
                    img.onload = () => resolve(img);
                    img.onerror = (error) => reject(error);
                    img.crossOrigin = 'anonymous';
                    img.src = imageUrl;
                });

                await loadImage();

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                let r = 0, g = 0, b = 0;
                const pixelCount = data.length / 4;

                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                }

                r = Math.floor(r / pixelCount);
                g = Math.floor(g / pixelCount);
                b = Math.floor(b / pixelCount);

                const primary = `rgb(${r}, ${g}, ${b})`;
                const secondary = `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`;

                setColors({ primary, secondary });
            } catch (error) {
                setColors({
                    primary: 'rgb(99, 102, 241)',
                    secondary: 'rgb(67, 56, 202)'
                });
            }
        };

        extractColors();
    }, [imageUrl]);

    return colors;
};

// Componente para cada tarjeta de producto con oferta (igual que HomeView)
const ProductOfferCard: React.FC<{ product: any; onClick: () => void }> = ({ product, onClick }) => {
    const colors = useImageColors(product.rectangularImageUrl || product.squareImageUrl);

    return (
        <div
            className="group relative rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer h-32 shadow-xl hover:shadow-2xl"
            onClick={onClick}
            style={{
                backgroundColor: colors?.primary || 'rgb(99, 102, 241)',
                backgroundImage: colors 
                    ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    : 'linear-gradient(135deg, rgb(99, 102, 241), rgb(67, 56, 202))',
                border: colors 
                    ? `1px solid ${colors.primary}`
                    : '1px solid rgb(99, 102, 241)'
            }}
        >
            <div className="flex h-full">
                {/* Product Image - Lado izquierdo */}
                <div className="w-32 h-32 flex-shrink-0 relative">
                    <img
                        src={product.rectangularImageUrl || product.squareImageUrl || 'https://via.placeholder.com/128x128/6366f1/ffffff?text=Producto'}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-l-xl"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/128x128/6366f1/ffffff?text=Producto';
                        }}
                    />
                    {/* Offer Badge */}
                    {product.offers && product.offers.length > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            OFERTA
                        </div>
                    )}
                </div>
                
                {/* Product Info - Lado derecho */}
                <div className="flex-1 min-w-0 p-4 flex flex-col justify-center relative">
                    <h3 className="font-bold text-white text-base mb-2 group-hover:text-white/90 transition-colors duration-300 truncate drop-shadow-sm">
                        {product.title}
                    </h3>
                    <p className="text-white/80 text-sm drop-shadow-sm">
                        {product.category?.name || 'Producto'}
                    </p>
                    
                    {/* Decorative element */}
                    <div 
                        className="absolute bottom-2 left-4 w-8 h-0.5 rounded-full opacity-60"
                        style={{
                            background: colors?.primary || 'rgba(255, 255, 255, 0.6)'
                        }}
                    />
                </div>
                
                {/* Arrow indicator */}
                <div className="flex-shrink-0 p-4 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                        style={{
                            background: colors
                                ? `${colors.secondary}CC`
                                : 'rgba(255, 255, 255, 0.2)',
                            border: `1px solid ${colors?.primary || 'rgba(255, 255, 255, 0.3)'}60`
                        }}
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AllOffersView() {
    const navigate = useNavigate();

    // Query para obtener todas las ofertas (igual que HomeView)
    const { data: offers = [], isLoading: offersLoading, error: offersError } = useQuery({
        queryKey: ['products-with-offers'],
        queryFn: getProductsWithOffers,
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    // Query para obtener categorías (para el sidebar)
    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    // Manejar errores
    if (offersError) {
        toast.error('Error al cargar las ofertas');
    }

    // Handler para navegar a un producto con oferta
    const handleOfferClick = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    // Handler para volver al inicio
    const handleBackToHome = () => {
        navigate('/');
    };

    // Handler para navegar a una categoría
    const handleCategoryClick = (categoryId: string) => {
        navigate(`/category/${categoryId}`);
    };

    // Loading state
    if (offersLoading || categoriesLoading) {
        return (
            <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white">Cargando ofertas...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
            <HomeHeader />
            
            <div className="pt-20 md:pt-24">
                <div className="flex flex-col lg:flex-row min-h-screen">
                    {/* Sidebar con categorías */}
                    <div className="w-full lg:w-72 bg-gray-800/50 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-700 lg:min-h-screen lg:rounded-2xl lg:ml-31 lg:mr-6 lg:mb-6">
                        <div className="p-4 lg:pl-6 lg:pr-8 lg:py-8">
                            <div className="mb-6">
                                <button 
                                    onClick={handleBackToHome}
                                    className="flex items-center text-gray-300 hover:text-white transition-colors mb-4"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Volver al inicio
                                </button>
                                
                                <div className="mb-4">
                                    <h2 className="text-white font-bold text-lg mb-2">📢 Ofertas Especiales</h2>
                                    <p className="text-gray-300 text-sm">Descubre nuestras mejores promociones</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                <div className="mb-4">
                                    <h3 className="text-gray-400 text-xs uppercase font-semibold mb-2">Explorar Categorías</h3>
                                </div>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 bg-gray-700/60 text-gray-300 hover:bg-gray-600/70 hover:text-white hover:shadow-md"
                                    >
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <span className="font-medium text-left text-sm">{category.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1 p-6 lg:p-8 lg:pl-4">
                        {/* Grid de ofertas - Estilo launcher de juegos */}
                        {offers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {offers.map((product: any) => (
                                    <ProductOfferCard
                                        key={product.id}
                                        product={product}
                                        onClick={() => handleOfferClick(product.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div 
                                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-800/80 via-orange-900/60 to-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-orange-800/30"
                                        style={{
                                            boxShadow: `
                                                0 10px 25px -5px rgba(0, 0, 0, 0.4),
                                                0 0 0 1px rgba(251, 146, 60, 0.2),
                                                inset 0 1px 0 rgba(255, 255, 255, 0.1)
                                            `
                                        }}
                                    >
                                        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    
                                    {/* Glow effect */}
                                    <div 
                                        className="absolute inset-0 rounded-xl blur-lg opacity-20 -z-10"
                                        style={{
                                            background: `linear-gradient(45deg, rgba(251, 146, 60, 0.3), rgba(194, 65, 12, 0.3))`
                                        }}
                                    ></div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-3">No hay ofertas disponibles</h3>
                                <p className="text-gray-300 mb-8 max-w-md mx-auto">Vuelve pronto para descubrir ofertas increíbles y promociones especiales</p>
                                
                                <button 
                                    onClick={handleBackToHome}
                                    className="group relative bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                                    style={{
                                        boxShadow: `
                                            0 8px 20px rgba(251, 146, 60, 0.3),
                                            0 0 0 1px rgba(251, 146, 60, 0.2)
                                        `
                                    }}
                                >
                                    <span className="relative z-10 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Volver al inicio
                                    </span>
                                    
                                    {/* Button glow effect */}
                                    <div 
                                        className="absolute inset-0 rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"
                                        style={{
                                            background: `linear-gradient(45deg, rgba(251, 146, 60, 0.4), rgba(194, 65, 12, 0.4))`
                                        }}
                                    ></div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <HomeFooter />
        </div>
    );
}
