interface NewsItem {
    id: number;
    title: string;
    image: string;
    category: string;
}

interface NewsAndPromotionsProps {
    news: NewsItem[];
    isLoading: boolean;
    error: string | null;
}

export const NewsAndPromotions = ({ news, isLoading, error }: NewsAndPromotionsProps) => {
    return (
        <div className="px-10 md:px-16 pb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase text-gray-900">
                    NOTICIAS & PROMOCIONES
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">Más noticias y promociones de juegos en</span>
                    <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center transition-colors">
                        Noticias SEA2M
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Estados de carga para noticias */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Skeleton para elemento principal */}
                    <div className="sm:col-span-2 lg:row-span-2 bg-gray-800 rounded-lg animate-pulse">
                        <div className="h-64 lg:h-80 bg-gray-700 rounded-lg"></div>
                    </div>
                    {/* Skeletons para elementos secundarios */}
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg animate-pulse">
                            <div className="h-32 lg:h-40 bg-gray-700 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {/* Grid de Noticias */}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {news.map((newsItem, index) => (
                        <div 
                            key={newsItem.id}
                            className={`group cursor-pointer ${
                                index === 0 ? 'sm:col-span-2 lg:row-span-2' : ''
                            }`}
                        >
                            <div className="relative rounded-lg overflow-hidden bg-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
                                {/* Imagen */}
                                <div className={`relative ${
                                    index === 0 ? 'h-64 lg:h-80' : 'h-32 lg:h-40'
                                }`}>
                                    <img 
                                        src={newsItem.image}
                                        alt={newsItem.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Overlay gradiente */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    
                                    {/* Contenido superpuesto */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className={`text-white font-semibold leading-tight group-hover:text-blue-300 transition-colors ${
                                            index === 0 ? 'text-lg lg:text-xl mb-2' : 'text-sm'
                                        }`}>
                                            {newsItem.title}
                                        </h3>
                                        
                                        {/* Badge de categoría solo para el elemento principal */}
                                        {index === 0 && (
                                            <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded uppercase font-bold">
                                                {newsItem.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
