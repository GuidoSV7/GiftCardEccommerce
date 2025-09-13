import { useQuery } from '@tanstack/react-query';
import { getOffers, type Offer } from '../../../services/offerService';
import { useState, useMemo } from 'react';
import { useCarouselStore } from '../../../stores/carouselStore';
import CarouselLimitModal from '../../../components/CarouselLimitModal';

export default function ActiveOffersView() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['offers'],
    queryFn: getOffers
  });

  const { 
    toggleOffer, 
    isOfferSelected, 
    canSelectMore, 
    getTotalSelected 
  } = useCarouselStore();

  // Filtrar solo ofertas activas (asumiendo que todas están activas por defecto)
  const activeOffers = useMemo(() => {
    if (!data) return [];
    return data.filter((offer: Offer) => {
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.discount.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [data, searchTerm]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ofertas activas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar</h2>
          <p className="text-gray-600">No se pudieron cargar las ofertas activas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-gray-800">Ofertas Activas</h1>
        <p className="text-xl font-light text-gray-500">
          Visualiza todas las ofertas activas del sistema
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Buscador */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar oferta activa
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por título o descuento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Información del carrusel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrusel
            </label>
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              {getTotalSelected()}/5 seleccionados
            </div>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {searchTerm && (
          <div className="mt-4">
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ofertas Activas</p>
              <p className="text-3xl font-bold text-green-600">{activeOffers.length}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Carrusel</p>
              <p className="text-3xl font-bold text-blue-600">
                {activeOffers.filter(offer => isOfferSelected(offer.id.toString())).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-3xl font-bold text-purple-600">
                {activeOffers.filter(offer => !isOfferSelected(offer.id.toString())).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {activeOffers.length === 0 ? (
         <div className="bg-gray-50 rounded-lg p-8 text-center">
           <h3 className="text-lg font-medium text-gray-600 mb-2">
             {data && data.length === 0 ? 'No hay ofertas activas' : 'No se encontraron ofertas'}
           </h3>
           <p className="text-gray-500">
             {data && data.length === 0 
               ? 'Aún no se han creado ofertas en el sistema.' 
               : 'Intenta ajustar los filtros de búsqueda.'}
           </p>
         </div>
       ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOffers.map((offer: Offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{offer.title}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">{offer.price}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {offer.discount}
                  </span>
                </div>
                
                {/* Checkbox para carrusel */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isOfferSelected(offer.id.toString())}
                      onChange={() => toggleOffer(offer.id.toString())}
                      disabled={!isOfferSelected(offer.id.toString()) && !canSelectMore()}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {isOfferSelected(offer.id.toString()) ? 'En carrusel' : 'Agregar al carrusel'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 text-center">
        Mostrando {activeOffers.length} ofertas activas
      </div>

      {/* Modal de límite del carrusel */}
      <CarouselLimitModal />
    </div>
  );
}
