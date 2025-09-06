import { OfferCard } from '../components/offers/OfferCard';
import { Carousel } from '../components/carousel/Carousel';
import { GameSection } from '../components/games/GameSection';

import { CardGridSection } from '../components/cards/CardGridSection';
import { HomeFooter } from '../components/home/HomeFooter';
import { getOffers } from '../services/offerService';
import { getGameCards } from '../services/gameCardService';
import {getCategories, getProducts } from '../services/productService';


import HomeHeader from '../components/home/HomeHeader';
import { useQuery } from '@tanstack/react-query';




export const HomeView = () => {
    // Queries individuales con TanStack Query
    const { data: offers = [], isLoading: offersLoading, error: offersError } = useQuery({
        queryKey: ['offers'],
        queryFn: getOffers,
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
        queryFn: getProducts,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    // Log de errores para debugging (solo en desarrollo)
    if (offersError) console.error('Error en ofertas:', offersError);
    if (gameCardsError) console.error('Error en game cards:', gameCardsError);
    if (productsError) console.error('Error en productos:', productsError);
    if (categoriesError) console.error('Error en categorías:', categoriesError);

    return (
        <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
            <HomeHeader />
            {/* Carousel and Offers Section */}
            <div className="w-full pt-20 md:pt-24">
                {/* Carousel Section */}
                <div className="w-full">
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                        <Carousel offers={offers} products={products} />
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
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Ver más
                            </button>
                        </div>

                        {/* Carrusel de Ofertas en móvil, grid en desktop */}
                        <>
                        {/* Carrusel horizontal solo en móvil */}
                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory sm:hidden pb-2 -mx-2 px-2">
                            {offers.map((offer) => (
                                <div key={offer.id} className="min-w-0 w-full max-w-xs snap-center flex-shrink-0">
                                    <OfferCard
                                        image={offer.image}
                                        price={offer.price}
                                        title={offer.title}
                                        discount={offer.discount}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Grid en tablet y desktop */}
                        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {offers.map((offer) => (
                                <OfferCard
                                    key={offer.id}
                                    image={offer.image}
                                    price={offer.price}
                                    title={offer.title}
                                    discount={offer.discount}
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
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-full">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Categoría por defecto - Games */}
                                    <div className="flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4">
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Games</h2>
                                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                            {[
                                                { id: '1', title: 'Steam Wallet', imageUrl: 'https://via.placeholder.com/200x150/1e40af/ffffff?text=Steam' },
                                                { id: '2', title: 'PlayStation Store', imageUrl: 'https://via.placeholder.com/200x150/006fcd/ffffff?text=PSN' },
                                                { id: '3', title: 'Xbox Live', imageUrl: 'https://via.placeholder.com/200x150/107c10/ffffff?text=Xbox' },
                                                { id: '4', title: 'Nintendo eShop', imageUrl: 'https://via.placeholder.com/200x150/e60012/ffffff?text=Nintendo' }
                                            ].map((product) => (
                                                <div key={product.id} className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                                                    <img 
                                                        src={product.imageUrl} 
                                                        alt={product.title}
                                                        className="w-full h-20 object-cover"
                                                    />
                                                    <div className="p-2">
                                                        <h3 className="text-white text-sm font-medium truncate">{product.title}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Categoría por defecto - Entertainment */}
                                    <div className="flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4">
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Entertainment</h2>
                                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                            {[
                                                { id: '5', title: 'Netflix', imageUrl: 'https://via.placeholder.com/200x150/e50914/ffffff?text=Netflix' },
                                                { id: '6', title: 'Spotify', imageUrl: 'https://via.placeholder.com/200x150/1db954/ffffff?text=Spotify' },
                                                { id: '7', title: 'Disney+', imageUrl: 'https://via.placeholder.com/200x150/113ccf/ffffff?text=Disney+' },
                                                { id: '8', title: 'Amazon Prime', imageUrl: 'https://via.placeholder.com/200x150/00a8e1/ffffff?text=Prime' }
                                            ].map((product) => (
                                                <div key={product.id} className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                                                    <img 
                                                        src={product.imageUrl} 
                                                        alt={product.title}
                                                        className="w-full h-20 object-cover"
                                                    />
                                                    <div className="p-2">
                                                        <h3 className="text-white text-sm font-medium truncate">{product.title}</h3>
                                                    </div>
                                                </div>
                                            ))}
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
        </div>
    );
};