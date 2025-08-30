import { OfferCard } from '../components/offers/OfferCard';
import { useState, useEffect } from 'react';
import { Carousel } from '../components/carousel/Carousel';
import { GameSection } from '../components/games/GameSection';

import { CardGridSection } from '../components/cards/CardGridSection';
import { HomeFooter } from '../components/home/HomeFooter';
import { getOffers } from '../services/offerService';
import { getCarouselItems } from '../services/carouselService';
import { getGameCards } from '../services/gameCardService';
import { getGifcardsWithCategories, getCategories } from '../services/gifcardService';
import type { Offer } from '../services/offerService';
import type { CarouselItem } from '../services/carouselService';
import type { GameCardData } from '../services/gameCardService';
import type { Gifcard, Category } from '../services/gifcardService';

import HomeHeader from '../components/home/HomeHeader';




export const HomeView = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
    const [gameCards, setGameCards] = useState<GameCardData[]>([]);
    const [gifcards, setGifcards] = useState<Gifcard[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [offersData, carouselData, gameCardsData, gifcardsData, categoriesData] = await Promise.all([
                    getOffers(),
                    getCarouselItems(),
                    getGameCards(),
                    getGifcardsWithCategories(),
                    getCategories(),
          
                ]);
                setOffers(offersData);
                setCarouselItems(carouselData);
                setGameCards(gameCardsData);
                setGifcards(gifcardsData);
                setCategories(categoriesData);

                setError(null);
            } catch (e) {
                setError('Error al cargar los datos');
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
            <HomeHeader />
            {/* Carousel and Offers Section */}
            <div className="w-full pt-20 md:pt-24">
                {/* Carousel Section */}
                <div className="w-full">
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                        {!isLoading && !error && <Carousel items={carouselItems} />}
                        {isLoading && (
                            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden mb-8 bg-gray-800">
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ofertas Section */}
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

                    {/* Estados de carga y error */}
                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                            <p className="text-white mt-4">Cargando ofertas...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}

                    {/* Carrusel de Ofertas en móvil, grid en desktop */}
                    {!isLoading && !error && (
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
                    )}
                </div>
            </div>

            {/* Gift Cards Sections */}
            {isLoading ? (
                <div className="px-10 md:px-16 py-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                </div>
            ) : error ? (
                <div className="px-10 md:px-16 py-12">
                    <div className="text-center text-red-500">
                        {error}
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {categories.map((category) => {
                            const categoryGifcards = gifcards
                                .filter(gc => gc.categoryId.name === category.name)
                                .slice(-4); // Tomar las últimas 4 gifcards de cada categoría
                            if (categoryGifcards.length === 0) return null;
                            
                            return (
                                <CardGridSection
                                    key={category.id}
                                    title={category.name}
                                    gifcards={categoryGifcards}
                                />
                            );
                        })}
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
                            isLoading={isLoading}
                            error={error}
                        />

                        {/* Popular Game Recharge Section */}
                        <GameSection
                            title="RECARGA DE JUEGO POPULAR"
                            games={gameCards.filter(card => card.category === 'recarga')}
                            isLoading={isLoading}
                            error={error}
                        />

                        
                    </div>
                </div>
                


                {/* Footer específico para Home */}
                <HomeFooter />
            </div>
        </div>
    );
};