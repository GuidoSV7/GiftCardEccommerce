
import { getProductsAll, type Product } from '../../services/productService';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useCarouselStore } from '../../stores/carouselStore';
import CarouselLimitModal from '../../components/CarouselLimitModal';
import { 
    ProductFilters, 
    ProductTable, 
    EmptyState, 
    LoadingState, 
    ErrorState 
} from '../../components/products';

export default function ProductsView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProductsAll
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
    setCategoryFilter('');
    setStateFilter('');
  };

  const handleClearCarousel = () => {
    if (confirm('¿Estás seguro de que quieres limpiar toda la selección del carrusel?')) {
      // Limpiar localStorage directamente
      localStorage.removeItem('carousel-config');
      // Recargar la página para que el store se reinicialice
      window.location.reload();
    }
  };

  // Obtener categorías únicas para el filtro
  const categories = useMemo((): string[] => {
    if (!data) return [];
    const categoryNames: string[] = [];
    data.forEach((product: Product) => {
      if (product.category?.name && typeof product.category.name === 'string') {
        categoryNames.push(product.category.name);
      }
    });
    const uniqueCategories = [...new Set(categoryNames)];
    return uniqueCategories.sort();
  }, [data]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!data) return [];
    
    return data.filter((product: Product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !categoryFilter || product.category?.name === categoryFilter;
      
      const matchesState = !stateFilter || 
                          (stateFilter === 'active' && product.state === true) ||
                          (stateFilter === 'inactive' && product.state === false);
      
      return matchesSearch && matchesCategory && matchesState;
    });
  }, [data, searchTerm, categoryFilter, stateFilter]);


  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-gray-800">Todos los Productos</h1>
        <p className="text-xl font-light text-gray-500">
          Gestiona y visualiza todos los productos del sistema
        </p>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        categories={categories}
        totalSelected={getTotalSelected()}
        onClearFilters={handleClearFilters}
        onClearCarousel={handleClearCarousel}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState 
          hasProducts={data && data.length > 0} 
          filteredCount={filteredProducts.length} 
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          isProductSelected={isProductSelected}
          canSelectMore={canSelectMore}
          onToggleProduct={toggleProduct}
          onEditProduct={handleEditProduct}
        />
      )}

      <div className="mt-6 text-sm text-gray-500 text-center">
        Mostrando {filteredProducts.length} de {data?.length || 0} productos
      </div>

      {/* Modal de límite del carrusel */}
      <CarouselLimitModal />
    </div>
  );
}
