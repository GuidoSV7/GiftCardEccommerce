import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../../../services/productService';
import { useNavigate, useParams } from 'react-router-dom';
import ProductPricing from '../../../components/dashboard/products/ProductPricing';

export default function ProductPricingView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Obtener el producto actual
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id
  });

  if (productLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-4">El producto que buscas no existe o ha sido eliminado</p>
          <button
            onClick={() => navigate('/dashboard/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Configurar Precios</h1>
          <p className="text-gray-600 mt-1">Gestiona los precios y ofertas para: {product.title}</p>
        </div>
      </div>

      {/* Product Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          {/* Imágenes del producto */}
          <div className="flex gap-2">
            {product.squareImageUrl && (
              <img
                src={product.squareImageUrl}
                alt={`${product.title} - Cuadrada`}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                title="Imagen cuadrada"
              />
            )}
            {product.rectangularImageUrl && (
              <img
                src={product.rectangularImageUrl}
                alt={`${product.title} - Rectangular`}
                className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                title="Imagen rectangular"
              />
            )}
            {product.smallSquareImageUrl && (
              <img
                src={product.smallSquareImageUrl}
                alt={`${product.title} - Cuadrada pequeña`}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                title="Imagen cuadrada pequeña"
              />
            )}
            {/* Fallback si no hay imágenes */}
            {!product.squareImageUrl && !product.rectangularImageUrl && !product.smallSquareImageUrl && (
              <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
            <p className="text-gray-600 mt-1">{product.category?.name}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                product.state 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.state ? 'Activo' : 'Inactivo'}
              </span>
              {product.purchaseCost && (
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  Costo: ${product.purchaseCost}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/products/edit/${product.id}`)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Producto
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ProductPricing
          productId={id!}
          isEditMode={true}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
        >
          Volver a Productos
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Editar Producto
          </button>
          <button
            onClick={() => navigate('/dashboard/products')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
