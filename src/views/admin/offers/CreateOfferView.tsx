import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface OfferFormData {
  title: string;
  image: string;
  price: string;
  discount: string;
}

export default function CreateOfferView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OfferFormData>();

  const createOfferMutation = useMutation({
    mutationFn: async (offerData: OfferFormData) => {
      // Aquí deberías implementar la llamada al API para crear la oferta
      // Por ahora simulamos la creación
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la oferta');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Oferta creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      reset();
      navigate('/dashboard/offers');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la oferta');
    },
  });

  const onSubmit = async (data: OfferFormData) => {
    setIsSubmitting(true);
    try {
      await createOfferMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-gray-800">Crear Nueva Oferta</h1>
        <p className="text-xl font-light text-gray-500">
          Agrega una nueva oferta al sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título de la Oferta *
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('title', {
                required: 'El título es obligatorio',
                minLength: {
                  value: 3,
                  message: 'El título debe tener al menos 3 caracteres'
                }
              })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Imagen */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen *
            </label>
            <input
              id="image"
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('image', {
                required: 'La URL de la imagen es obligatoria',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Debe ser una URL válida'
                }
              })}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Precio *
            </label>
            <input
              id="price"
              type="text"
              placeholder="Ej: $29.99"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('price', {
                required: 'El precio es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El precio debe tener al menos 2 caracteres'
                }
              })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Descuento */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
              Descuento *
            </label>
            <input
              id="discount"
              type="text"
              placeholder="Ej: 50% OFF"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('discount', {
                required: 'El descuento es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El descuento debe tener al menos 2 caracteres'
                }
              })}
            />
            {errors.discount && (
              <p className="mt-1 text-sm text-red-600">{errors.discount.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/offers')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Oferta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
