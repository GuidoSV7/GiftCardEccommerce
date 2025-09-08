import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMember } from '../../services/memberService';
import { toast } from 'react-toastify';
import type { Member } from '../../services/memberService';

interface MemberFormData {
  userName: string;
  email: string;
  discount: number;
  isActive: boolean;
}

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMember: Member | null;
}

export default function EditMemberModal({ isOpen, onClose, selectedMember }: EditMemberModalProps) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors },  reset } = useForm<MemberFormData>();

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberFormData }) => 
      updateMember(id, data),
    onSuccess: () => {
      toast.success('Miembro actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el miembro';
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: MemberFormData) => {
    if (selectedMember) {
      updateMemberMutation.mutate({ id: selectedMember.id, data });
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  if (!isOpen || !selectedMember) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Editar Miembro</h3>
            <p className="text-sm text-gray-600 mt-1">Modifica la información del miembro</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <form id="edit-member-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Nombre de usuario */}
            <div>
              <label htmlFor="edit-userName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario *
              </label>
              <input
                id="edit-userName"
                type="text"
                defaultValue={selectedMember.userName}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                {...register('userName', {
                  required: 'El nombre de usuario es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                })}
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="edit-email"
                type="email"
                defaultValue={selectedMember.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                {...register('email', {
                  required: 'El email es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Descuento */}
            <div>
              <label htmlFor="edit-discount" className="block text-sm font-medium text-gray-700 mb-2">
                Descuento (%)
              </label>
              <input
                id="edit-discount"
                type="number"
                step="0.01"
                min="0"
                max="100"
                defaultValue={selectedMember.discount}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                {...register('discount', {
                  min: {
                    value: 0,
                    message: 'El descuento no puede ser negativo'
                  },
                  max: {
                    value: 100,
                    message: 'El descuento no puede ser mayor a 100%'
                  }
                })}
              />
              {errors.discount && (
                <p className="mt-1 text-sm text-red-600">{errors.discount.message}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={selectedMember.isActive}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...register('isActive')}
                />
                <span className="text-sm font-medium text-gray-700">
                  Miembro activo
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Los miembros activos pueden acceder al sistema
              </p>
            </div>
          </form>
        </div>
        
        {/* Botones fijos en la parte inferior */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-member-form"
              disabled={updateMemberMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {updateMemberMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Actualizar Miembro
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
