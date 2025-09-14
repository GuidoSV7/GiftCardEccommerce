import { useQuery } from '@tanstack/react-query';
import { getProductsWithOffers, type ProductWithOffer } from '../../../services/productOffersService';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useCarouselStore } from '../../../stores/carouselStore';
import CarouselLimitModal from '../../../components/CarouselLimitModal';
import ErrorBoundary from '../../../components/ErrorBoundary';

export default function ProductOffersView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [discountFilter, setDiscountFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['product-offers'],
    queryFn: getProductsWithOffers,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { 
    toggleProduct, 
    isProductSelected, 
    canSelectMore, 
    getTotalSelected 
  } = useCarouselStore();

  const handleEditProduct = (productId: string) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDiscountFilter('');
    setStateFilter('');
  };

  const handleClearCarousel = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar toda la selección del carrusel?')) {
      localStorage.removeItem('carousel-config');
      window.location.reload();
    }
  };


  // Filtrar ofertas
  const filteredOffers = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    try {
        return data.filter((offer: ProductWithOffer) => {
          if (!offer || !offer.title || !offer.offerPrice) return false;
          
          const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase());
          
          let matchesDiscount = true;
          if (discountFilter) {
            const discount = Number(offer.offerPrice.discountPercentage || 0);
            switch (discountFilter) {
              case 'low':
                matchesDiscount = discount >= 5 && discount < 20;
                break;
              case 'medium':
                matchesDiscount = discount >= 20 && discount < 40;
                break;
              case 'high':
                matchesDiscount = discount >= 40;
                break;
            }
          }
          
          let matchesState = true;
          if (stateFilter) {
            if (stateFilter === 'active') {
              matchesState = offer.state === true;
            } else if (stateFilter === 'inactive') {
              matchesState = offer.state === false;
            }
          }
          
          return matchesSearch && matchesDiscount && matchesState;
        });
    } catch (error) {
      console.error('Error filtering offers:', error);
      return [];
    }
  }, [data, searchTerm, discountFilter, stateFilter]);

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
    <ErrorBoundary>
      <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-gray-800">Ofertas de Productos</h1>
        <p className="text-xl font-light text-gray-500">
          Productos con precios promocionales activos
        </p>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Buscador por título */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar producto
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por descuento */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
              Rango de descuento
            </label>
            <select
              id="discount"
              value={discountFilter}
              onChange={(e) => setDiscountFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los descuentos</option>
              <option value="low">Bajo (5-19%)</option>
              <option value="medium">Medio (20-39%)</option>
              <option value="high">Alto (40%+)</option>
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="state"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
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

          {/* Botones de acción */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Acciones
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleClearCarousel}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Limpiar Carrusel
              </button>
            </div>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {(searchTerm || discountFilter || stateFilter) && (
          <div className="mt-4">
            <button
              onClick={handleClearFilters}
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
             {data && Array.isArray(data) && data.length === 0 ? 'No hay ofertas activas' : 'No se encontraron ofertas'}
           </h3>
           <p className="text-gray-500">
             {data && Array.isArray(data) && data.length === 0 
               ? 'No hay productos con precios promocionales activos.' 
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
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oferta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Original
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Final
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
                {(() => {
                  try {
                    return filteredOffers.map((offer: ProductWithOffer, index: number) => {
                  // Validación adicional para cada oferta
                  if (!offer || !offer.id || !offer.title || !offer.offerPrice) {
                    console.error('Invalid offer data at index:', index, offer);
                    return null;
                  }
                  
                  // Log detallado para debugging
                  console.log('Rendering offer at index:', index, {
                    id: offer.id,
                    title: offer.title,
                    offerPrice: offer.offerPrice,
                    value: offer.offerPrice?.value,
                    discountPercentage: offer.offerPrice?.discountPercentage,
                    finalPrice: offer.offerPrice?.finalPrice
                  });
                  
                  return (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={offer.imageUrl}
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
                      {offer.category?.name || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {offer.offerPrice.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(offer.offerPrice.value || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        -{Number(offer.offerPrice.discountPercentage || 0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${Number(offer.offerPrice.finalPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isProductSelected(offer.id)}
                          onChange={() => toggleProduct(offer.id)}
                          disabled={!isProductSelected(offer.id) && !canSelectMore()}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {isProductSelected(offer.id) ? 'En carrusel' : 'Agregar'}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditProduct(offer.id)}
                        className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    </td>
                  </tr>
                  );
                });
                  } catch (error) {
                    console.error('Error rendering offers:', error);
                    return (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-red-600">
                          Error al renderizar las ofertas: {error instanceof Error ? error.message : 'Error desconocido'}
                        </td>
                      </tr>
                    );
                  }
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 text-center">
        Mostrando {filteredOffers.length} de {data && Array.isArray(data) ? data.length : 0} ofertas
      </div>

      {/* Modal de límite del carrusel */}
      <CarouselLimitModal />
      </div>
    </ErrorBoundary>
  );
}
