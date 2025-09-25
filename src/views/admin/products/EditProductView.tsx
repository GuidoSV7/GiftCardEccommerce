import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductById, updateProduct } from '../../../services/productService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProductFormData } from '../../../types';
import ProductForm from '../../../components/dashboard/products/ProductForm';

export default function EditProductView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<ProductFormData>();
  
  // Obtener el producto actual
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id
  });


  // Mutation para actualizar producto
  const updateProductMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: ProductFormData }) => 
      updateProduct(id, formData),
    onSuccess: () => {
      toast.success('Producto actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      navigate('/products');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el producto';
      toast.error(errorMessage);
    }
  });

  // Cargar datos del producto en el formulario
  useEffect(() => {
    if (product) {
      setValue('title', product.title);
      setValue('description', product.description);
      setValue('squareImageUrl', product.squareImageUrl || '');
      setValue('rectangularImageUrl', product.rectangularImageUrl || '');
      setValue('smallSquareImageUrl', product.smallSquareImageUrl || '');
      setValue('redeem', product.redeem);
      setValue('termsConditions', product.termsConditions);
      setValue('purchaseCost', product.purchaseCost);
      setValue('state', product.state);
      
      // Asignar directamente el ID de la categoría del producto
      if (product.category?.id) {
        setValue('categoryId', product.category.id);
      }
    }
  }, [product, setValue]);

  const onSubmit = (data: ProductFormData) => {
    if (id) {
      updateProductMutation.mutate({ id, formData: data });
    }
  };

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
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-3xl font-bold text-gray-800">Editar Producto</h1>
          <p className="text-gray-600 mt-1">Modifica la información del producto: {product.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ProductForm 
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
            productId={id}
            isEditMode={true}
          />

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateProductMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {updateProductMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Actualizar Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
