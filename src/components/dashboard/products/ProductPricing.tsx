import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { productPricingService, type ProductPrice, type CreateProductPriceDto, type UpdateProductPriceDto } from '../../../services/productPricingService';
import ErrorMessage from '../../ErrorMessage';

interface ProductPricingProps {
  productId: string; // Ahora es requerido ya que solo se usa en modo edición
  isEditMode: boolean; // Ahora es requerido
}

interface PriceFormData {
  name: string;
  value: string;
  discountPercentage: string;
  state: boolean;
}

export default function ProductPricing({ productId, isEditMode }: ProductPricingProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<ProductPrice | null>(null);
  const [formData, setFormData] = useState<PriceFormData>({
    name: '',
    value: '',
    discountPercentage: '',
    state: true
  });

  const queryClient = useQueryClient();

  // Función para normalizar los datos de precio del backend
  const normalizePrice = (price: any): ProductPrice => {
    return {
      ...price,
      value: Number(price.value),
      discountPercentage: price.discountPercentage ? Number(price.discountPercentage) : undefined
    };
  };

  // Query para obtener precios del producto
  const { data: rawPrices = [], isLoading, error } = useQuery({
    queryKey: ['product-prices', productId],
    queryFn: () => productPricingService.findByProduct(productId),
    enabled: !!productId && isEditMode
  });

  // Normalizar los precios para asegurar tipos correctos
  const prices = rawPrices.map(normalizePrice);

  // Mutación para crear precio
  const createPriceMutation = useMutation({
    mutationFn: (data: CreateProductPriceDto) => {
      console.log('Sending create request with data:', data);
      return productPricingService.create(data);
    },
    onSuccess: (response) => {
      console.log('Price created successfully:', response);
      toast.success('Precio creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['product-prices', productId] });
      handleCloseModal();
    },
    onError: (error: any) => {
      console.error('Error creating price:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el precio';
      toast.error(errorMessage);
    }
  });

  // Mutación para actualizar precio
  const updatePriceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductPriceDto }) => 
      productPricingService.update(id, data),
    onSuccess: () => {
      toast.success('Precio actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['product-prices', productId] });
      handleCloseModal();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el precio';
      toast.error(errorMessage);
    }
  });

  // Mutación para alternar estado
  const toggleStateMutation = useMutation({
    mutationFn: (id: string) => productPricingService.togglePriceState(id),
    onSuccess: () => {
      toast.success('Estado del precio actualizado');
      queryClient.invalidateQueries({ queryKey: ['product-prices', productId] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el estado';
      toast.error(errorMessage);
    }
  });

  // Mutación para eliminar precio
  const deletePriceMutation = useMutation({
    mutationFn: (id: string) => productPricingService.remove(id),
    onSuccess: () => {
      toast.success('Precio eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['product-prices', productId] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el precio';
      toast.error(errorMessage);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir que se propague al formulario padre
    
    console.log('Form data:', formData);
    console.log('Product ID:', productId);
    
    const priceData = {
      name: formData.name,
      value: parseFloat(formData.value),
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
      state: formData.state,
      productId: productId
    };

    console.log('Price data to send:', priceData);

    // Validación adicional
    if (!formData.name.trim()) {
      toast.error('El nombre del precio es requerido');
      return;
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      toast.error('El valor del precio debe ser mayor a 0');
      return;
    }

    if (formData.discountPercentage && (parseFloat(formData.discountPercentage) < 0 || parseFloat(formData.discountPercentage) > 100)) {
      toast.error('El porcentaje de descuento debe estar entre 0 y 100');
      return;
    }

    // Crear o actualizar precio
    if (editingPrice) {
      console.log('Updating price:', editingPrice.id);
      updatePriceMutation.mutate({ id: editingPrice.id, data: priceData });
    } else {
      console.log('Creating new price');
      createPriceMutation.mutate(priceData);
    }
  };

  const handleEdit = (price: ProductPrice) => {
    setEditingPrice(price);
    setFormData({
      name: price.name,
      value: Number(price.value).toString(),
      discountPercentage: price.discountPercentage ? Number(price.discountPercentage).toString() : '',
      state: price.state
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este precio?')) {
        deletePriceMutation.mutate(id);
    }
  };

  const handleToggleState = (id: string) => {
      toggleStateMutation.mutate(id);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPrice(null);
    setFormData({
      name: '',
      value: '',
      discountPercentage: '',
      state: true
    });
  };

  const calculateFinalPrice = (value: number | string, discountPercentage?: number | string) => {
    const numValue = Number(value);
    const numDiscount = Number(discountPercentage) || 0;
    
    if (!numDiscount) return numValue;
    return numValue * (1 - numDiscount / 100);
  };


  return (
    <div className="mb-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm uppercase font-bold text-gray-700">
            Gestión de Precios
          </h3>
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Información importante sobre precios:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Los productos pueden tener múltiples precios (regular, promocional, etc.)</li>
                  <li>• Cualquier precio con descuento será considerado como oferta</li>
                  <li>• Los precios con descuento aparecerán automáticamente en la sección de ofertas</li>
                  <li>• Un producto puede tener varias ofertas activas simultáneamente</li>
                  <li>• <strong>Precios inactivos</strong> no aparecerán en la tienda para los clientes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar Precio
        </button>
      </div>

      {isLoading && productId ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando precios...</span>
        </div>
      ) : error && productId ? (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <ErrorMessage>Error al cargar los precios del producto</ErrorMessage>
        </div>
      ) : prices.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <p className="text-gray-500 text-sm">No hay precios configurados para este producto</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prices.map((price) => (
            <div key={price.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-800">{price.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      price.state 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {price.state ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Precio base:</span> ${Number(price.value).toFixed(2)}
                    </div>
                    {price.discountPercentage && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Descuento:</span> {price.discountPercentage}%
                      </div>
                    )}
                    <div className="text-sm font-semibold text-green-600">
                      <span className="font-medium">Precio final:</span> ${calculateFinalPrice(price.value, price.discountPercentage).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleState(price.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      price.state 
                        ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                    title={price.state ? 'Desactivar precio (no aparecerá en tienda)' : 'Activar precio (aparecerá en tienda)'}
                  >
                    {price.state ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(price);
                    }}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    title="Editar precio"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(price.id);
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    title="Eliminar precio"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar precio */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPrice ? 'Editar Precio' : 'Agregar Nuevo Precio'}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCloseModal();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Precio
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Ej: Precio Regular, Oferta Especial"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor del Precio ($)
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje de Descuento (%)
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0"
                  step="0.01"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opcional. Deja vacío si no hay descuento.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="state"
                  checked={formData.state}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">
                  Precio activo
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCloseModal();
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createPriceMutation.isPending || updatePriceMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {createPriceMutation.isPending || updatePriceMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    editingPrice ? 'Actualizar' : 'Crear'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
