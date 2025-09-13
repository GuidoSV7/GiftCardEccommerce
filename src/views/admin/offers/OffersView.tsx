import { useQuery } from '@tanstack/react-query';
import { getOffers, type Offer } from '../../../services/offerService';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useCarouselStore } from '../../../stores/carouselStore';
import CarouselLimitModal from '../../../components/CarouselLimitModal';

export default function OffersView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  const handleEditOffer = (offerId: number) => {
    navigate(`/offers/edit/${offerId}`);
  };

  // Filtrar ofertas
  const filteredOffers = useMemo(() => {
    if (!data) return [];
    
    return data.filter((offer: Offer) => {
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.discount.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Para ofertas, asumimos que todas están activas por defecto
      // Si necesitas un campo de estado, deberías agregarlo al tipo Offer
      const matchesStatus = !statusFilter || statusFilter === 'active';
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ofertas...</p>
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
          <p className="text-gray-600">No se pudieron cargar las ofertas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-gray-800">Todas las Ofertas</h1>
        <p className="text-xl font-light text-gray-500">
          Gestiona y visualiza todas las ofertas del sistema
        </p>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buscador por título y descuento */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar oferta
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

          {/* Filtro por estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activa</option>
            </select>
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
        {(searchTerm || statusFilter) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {filteredOffers.length === 0 ? (
         <div className="bg-gray-50 rounded-lg p-8 text-center">
           <h3 className="text-lg font-medium text-gray-600 mb-2">
             {data && data.length === 0 ? 'No hay ofertas' : 'No se encontraron ofertas'}
           </h3>
           <p className="text-gray-500">
             {data && data.length === 0 
               ? 'Aún no se han creado ofertas en el sistema.' 
               : 'Intenta ajustar los filtros de búsqueda.'}
           </p>
         </div>
       ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oferta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrusel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOffers.map((offer: Offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={offer.image}
                            alt={offer.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {offer.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offer.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {offer.discount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isOfferSelected(offer.id.toString())}
                          onChange={() => toggleOffer(offer.id.toString())}
                          disabled={!isOfferSelected(offer.id.toString()) && !canSelectMore()}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {isOfferSelected(offer.id.toString()) ? 'En carrusel' : 'Agregar'}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditOffer(offer.id)}
                        className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 text-center">
        Mostrando {filteredOffers.length} de {data?.length || 0} ofertas
      </div>

      {/* Modal de límite del carrusel */}
      <CarouselLimitModal />
    </div>
  );
}
