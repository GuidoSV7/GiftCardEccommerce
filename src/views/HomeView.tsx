import { OfferCard } from '../components/offers/OfferCard';
import { Carousel } from '../components/carousel/Carousel';
import { GameSection } from '../components/games/GameSection';

import { CardGridSection } from '../components/cards/CardGridSection';
import { HomeFooter } from '../components/home/HomeFooter';
import { getOffers } from '../services/offerService';
import { getCarouselItems } from '../services/carouselService';
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

    const { data: carouselItems = [], isLoading: carouselLoading, error: carouselError } = useQuery({
        queryKey: ['carousel'],
        queryFn: getCarouselItems,
        retry: 2,
        staleTime: 5 * 60 * 1000,
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
    if (carouselError) console.error('Error en carousel:', carouselError);
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
                        {!carouselLoading && !carouselError && <Carousel items={carouselItems} />}
                        {carouselLoading && (
                            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden mb-8 bg-gray-800">
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                </div>
                            </div>
                        )}
                        {carouselError && (
                            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden mb-8 bg-gray-800">
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-red-500">Error al cargar carousel</p>
                                </div>
                            </div>
                        )}

                        {/* Carousel por defecto si no hay datos */}
                        {!carouselLoading && !carouselError && (!carouselItems || carouselItems.length === 0) && (
                            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden mb-8 rounded-lg">
                                <div className="flex h-full">
                                    {/* Imagen 1 */}
                                    <div className="flex-1 relative bg-gradient-to-br from-blue-600 to-blue-800">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">🎮</span>
                                                </div>
                                                <h3 className="text-xl font-bold">Gaming</h3>
                                                <p className="text-sm opacity-90">Steam, PlayStation, Xbox</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Imagen 2 */}
                                    <div className="flex-1 relative bg-gradient-to-br from-purple-600 to-purple-800">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">🎬</span>
                                                </div>
                                                <h3 className="text-xl font-bold">Entertainment</h3>
                                                <p className="text-sm opacity-90">Netflix, Spotify, Disney+</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Imagen 3 */}
                                    <div className="flex-1 relative bg-gradient-to-br from-green-600 to-green-800">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">💳</span>
                                                </div>
                                                <h3 className="text-xl font-bold">Gift Cards</h3>
                                                <p className="text-sm opacity-90">Amazon, Google Play</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ofertas Section - Solo mostrar si hay ofertas */}
                {!offersLoading && !offersError && offers && offers.length > 0 && (
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
                )}

                {/* Estados de carga y error para ofertas */}
                {offersLoading && (
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pb-8">
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                            <p className="text-white mt-4">Cargando ofertas...</p>
                        </div>
                    </div>
                )}

                {offersError && (
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pb-8">
                        <div className="text-center py-8">
                            <p className="text-red-500">Error al cargar ofertas</p>
                        </div>
                    </div>
                )}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        <GameSection
                            title="TARJETA DE JUEGO POPULAR"
                            games={gameCards.filter(card => card.category === 'tarjeta')}
                            isLoading={gameCardsLoading}
                            error={gameCardsError ? 'Error al cargar tarjetas de juego' : null}
                        />

                        {/* Popular Game Recharge Section */}
                        <GameSection
                            title="RECARGA DE JUEGO POPULAR"
                            games={gameCards.filter(card => card.category === 'recarga')}
                            isLoading={gameCardsLoading}
                            error={gameCardsError ? 'Error al cargar recargas de juego' : null}
                        />

                        
                    </div>
                </div>
                


                {/* Footer específico para Home */}
                <HomeFooter />
            </div>
        </div>
    );
};