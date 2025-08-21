import { OfferCard } from '../components/offers/OfferCard';
import { useState, useEffect } from 'react';
import { Carousel } from '../components/carousel/Carousel';
import { GameSection } from '../components/games/GameSection';
import { NewsAndPromotions } from '../components/news/NewsAndPromotions';
import { CardGridSection } from '../components/cards/CardGridSection';
import { getOffers } from '../services/offerService';
import { getCarouselItems } from '../services/carouselService';
import { getGameCards } from '../services/gameCardService';
import { getGridSections } from '../services/gridCardsService';
import type { Offer } from '../services/offerService';
import type { CarouselItem } from '../services/carouselService';
import type { GameCardData } from '../services/gameCardService';
import type { GridSection } from '../services/gridCardsService';
import { getNewsAndPromotions } from '../services/newsService';
import type { NewsItem } from '../services/newsService';

export const HomeView = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
    const [gameCards, setGameCards] = useState<GameCardData[]>([]);
    const [gridSections, setGridSections] = useState<GridSection[]>([]);
    const [newsAndPromotions, setNewsAndPromotions] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [offersData, carouselData, gameCardsData, gridSectionsData, newsData] = await Promise.all([
                    getOffers(),
                    getCarouselItems(),
                    getGameCards(),
                    getGridSections(),
                    getNewsAndPromotions()
                ]);
                setOffers(offersData);
                setCarouselItems(carouselData);
                setGameCards(gameCardsData);
                setGridSections(gridSectionsData);
                setNewsAndPromotions(newsData);
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
        <div className="min-h-screen">
            {/* Dark Section - Carrusel and Offers */}
            <div className="mx-10 md:mx-16 mt-12 bg-gray-900  overflow-hidden">
                {/* Carrusel Section */}
                <div className="px-8 md:px-10 pt-8">
                    {!isLoading && !error && <Carousel items={carouselItems} />}
                    {isLoading && (
                        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8 bg-gray-800">
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ofertas Section */}
                <div className="px-8 md:px-10 pb-8">
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

                    {/* Grid de Ofertas */}
                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    )}
                </div>
            </div>

            {/* Cards Grid Sections */}
            {isLoading ? (
                <div className="px-10 md:px-16 py-12 bg-white">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                </div>
            ) : error ? (
                <div className="px-10 md:px-16 py-12 bg-white">
                    <div className="text-center text-red-500">
                        {error}
                    </div>
                </div>
            ) : (
                <CardGridSection sections={gridSections} />
            )}

            /*
            <div className="bg-white pt-12">
                {/* Game Cards Sections */}
                <div className="px-10 md:px-16 pb-12">
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
                */

                {/* Noticias & Promociones Section */}
                <div className="pb-12">
                    <NewsAndPromotions
                        news={newsAndPromotions}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
};