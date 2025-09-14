import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import ErrorMessage from '../../ErrorMessage';
import type { ProductFormData } from '../../../types';

interface FormFieldProps {
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
}

export function TitleField({ register, errors }: FormFieldProps) {
    return (
        <div className="mb-5 space-y-3">
            <label htmlFor="title" className="text-sm uppercase font-bold">
                Título del Producto
            </label>
            <input
                id="title"
                className="w-full p-3 border border-gray-200 rounded"
                type="text"
                placeholder="Título del Producto"
                {...register("title", {
                    required: "El título del producto es obligatorio",
                })}
            />
            {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
        </div>
    );
}

export function StateField({ register }: { register: UseFormRegister<ProductFormData> }) {
    return (
        <div className="mb-5 space-y-3">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="state"
                    className="w-4 h-4"
                    {...register("state")}
                />
                <label htmlFor="state" className="text-sm uppercase font-bold cursor-pointer">
                    Producto Activo
                </label>
            </div>
        </div>
    );
}

interface CategoryFieldProps extends FormFieldProps {
    categories: { id: string; name: string }[] | undefined;
    categoriesLoading: boolean;
    onShowCategoryModal: () => void;
}

export function CategoryField({ 
    register, 
    errors, 
    categories, 
    categoriesLoading, 
    onShowCategoryModal 
}: CategoryFieldProps) {
    return (
        <div className="mb-5 space-y-3">
            <div className="flex items-center justify-between">
                <label htmlFor="categoryId" className="text-sm uppercase font-bold">
                    Categoría
                </label>
                <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={onShowCategoryModal}
                >
                    + Crear nueva categoría
                </button>
            </div>
            <select
                id="categoryId"
                className="w-full p-3 border border-gray-200 rounded"
                disabled={categoriesLoading}
                {...register("categoryId", {
                    required: "La categoría es obligatoria"
                })}
            >
                <option value="">Seleccionar categoría</option>
                {categoriesLoading ? (
                    <option value="" disabled>Cargando categorías...</option>
                ) : (
                    categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))
                )}
            </select>
            {errors.categoryId && (
                <ErrorMessage>{errors.categoryId.message}</ErrorMessage>
            )}
        </div>
    );
}
