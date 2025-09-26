import { OfferCard } from '../components/offers/OfferCard';
import { Carousel } from '../components/carousel/Carousel';
import { GameSection } from '../components/games/GameSection';

import { CardGridSection } from '../components/cards/CardGridSection';
import { HomeFooter } from '../components/home/HomeFooter';
import { ChatButton } from '../components/chat/ChatButton';
import { getGameCards } from '../services/gameCardService';
import {getCategories, getProducts } from '../services/productService';
import { getProductsWithOffers } from '../services/productOffersService';


import HomeHeader from '../components/home/HomeHeader';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';




export const HomeView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Verificar si hay un mensaje de error en el state de la navegación
    useEffect(() => {
        if (location.state?.message) {
            setErrorMessage(location.state.message);
            setShowErrorMessage(true);
            
            // Limpiar el mensaje después de 5 segundos
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
                setErrorMessage('');
                // Limpiar el state de la navegación
                window.history.replaceState({}, document.title);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [location.state]);

    // Queries individuales con TanStack Query
    const { data: offers = [], isLoading: offersLoading, error: offersError } = useQuery({
        queryKey: ['products-with-offers'],
        queryFn: getProductsWithOffers,
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });


    const { data: gameCards = [], isLoading: gameCardsLoading, error: gameCardsError } = useQuery({
        queryKey: ['gameCards'],
        queryFn: getGameCards,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts
    });


    const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });


    return (
        <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
            <HomeHeader />
            
            {/* Error Message */}
            {showErrorMessage && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4">
                    <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-sm font-medium">{errorMessage}</span>
                        </div>
                        <button 
                            onClick={() => {
                                setShowErrorMessage(false);
                                setErrorMessage('');
                                window.history.replaceState({}, document.title);
                            }}
                            className="ml-2 text-white hover:text-gray-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Carousel and Offers Section */}
            <div className="w-full pt-20 md:pt-24">
                {/* Carousel Section */}
                <div className="w-full">
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                        <Carousel />
                    </div>
                </div>

                {/* Ofertas Section */}
                {!offersLoading && !offersError && offers && offers.length > 0 ? (
                <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pb-8">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold uppercase text-white mb-2">
                                OFERTAS EXCLUSIVAS
                            </h2>
                            <p className="text-gray-300 text-sm">
                                ¡No te pierdas nuestras ofertas por tiempo limitado! ¡Descubre las ofertas actuales hoy!
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/offers')}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Ver más
                        </button>
                    </div>

                    {/* Carrusel de Ofertas en móvil, grid en desktop */}
                        <>
                        {/* Carrusel horizontal solo en móvil */}
                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory sm:hidden pb-2 -mx-2 px-2">
                            {offers.map((product) => (
                                <div key={product.id} className="min-w-0 w-full max-w-xs snap-center flex-shrink-0">
                                    <OfferCard
                                        product={product}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Grid en tablet y desktop */}
                        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {offers.map((product) => (
                                <OfferCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                        </>
                    </div>
                ) : !offersLoading && !offersError ? (
                    /* Mensaje cuando no hay ofertas */
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pb-8">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No hay ofertas por el momento</h3>
                            <p className="text-gray-400">Vuelve pronto para descubrir nuestras ofertas exclusivas</p>
                        </div>
                    </div>
                ) : offersLoading ? (
                    /* Estado de carga */
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pb-8">
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                            <p className="text-white mt-4">Cargando ofertas...</p>
                        </div>
                    </div>
                ) : offersError ? (
                    /* Estado de error - disfrazado como "no hay ofertas" */
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pb-8">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No hay ofertas disponibles</h3>
                            <p className="text-gray-400">Vuelve pronto para descubrir nuestras ofertas exclusivas</p>
                     </div>
                    </div>
                ) : null}
            </div>

            {/* Gift Cards Sections */}
            {productsLoading || categoriesLoading ? (
                <div className="px-10 md:px-16 py-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                </div>
            ) : productsError || categoriesError ? (
                <div className="px-10 md:px-16 py-12">
                    <div className="text-center text-red-500">
                        {productsError ? 'Error al cargar productos' : 'Error al cargar categorías'}
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {categories && categories.length > 0 && products && products.length > 0 ? (
                            categories.map((category) => {
                            const categoryProducts = products
                                    .filter(product => product && product.category && product.category.name === category.name)
                                .slice(-4); // Tomar las últimas 4 products de cada categoría
                            if (categoryProducts.length === 0) return null;
                            
                            return (
                                <CardGridSection
                                    key={category.id}
                                    title={category.name}
                                    products={categoryProducts}
                                    categoryId={category.id}
                                />
                            );
                            })
                        ) : (
                            <div className="col-span-full">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Mensaje cuando no hay productos - Columna izquierda */}
                                    <div className="flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-6">
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">No hay productos disponibles</h3>
                                            <p className="text-gray-400 text-sm">Vuelve pronto para descubrir nuestros productos</p>
                                        </div>
                                    </div>

                                    {/* Mensaje cuando no hay productos - Columna derecha */}
                                    <div className="flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-6">
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">No hay productos disponibles</h3>
                                            <p className="text-gray-400 text-sm">Vuelve pronto para descubrir nuestros productos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            
            <div className="pt-6">
                {/* Game Cards Sections */}
                <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pb-12">
                    {gameCardsLoading ? (
                        /* Estado de carga para Game Cards */
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                            <p className="text-white mt-4">Cargando tarjetas de juego...</p>
                        </div>
                    ) : gameCardsError ? (
                        /* Estado de error para Game Cards - disfrazado como "no hay tarjetas" */
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No hay tarjetas de juego disponibles</h3>
                            <p className="text-gray-400">Vuelve pronto para descubrir nuestras tarjetas de juego</p>
                        </div>
                    ) : gameCards && gameCards.length > 0 ? (
                        /* Mostrar Game Cards si hay datos */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        <GameSection
                            title="TARJETA DE JUEGO POPULAR"
                            games={gameCards.filter(card => card.category === 'tarjeta')}
                                isLoading={false}
                                error={null}
                        />

                        {/* Popular Game Recharge Section */}
                        <GameSection
                            title="RECARGA DE JUEGO POPULAR"
                            games={gameCards.filter(card => card.category === 'recarga')}
                                isLoading={false}
                                error={null}
                            />
                        </div>
                    ) : (
                        /* Mensaje cuando no hay Game Cards */
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No hay tarjetas de juego por el momento</h3>
                            <p className="text-gray-400">Vuelve pronto para descubrir nuestras tarjetas de juego</p>
                    </div>
                    )}
                </div>
                


                {/* Footer específico para Home */}
                <HomeFooter />
            </div>

            {/* Chat Support Button */}
            <ChatButton />
        </div>
    );
};