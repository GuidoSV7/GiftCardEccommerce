
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import ErrorMessage from '../../ErrorMessage';
import type { GifcardFormData } from '../../../types';

type ProductFormProps = {
    register :  UseFormRegister<GifcardFormData>

    errors: FieldErrors<GifcardFormData>

    }

export default function ProductForm({ register, errors }: ProductFormProps) {

    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre del Producto
                </label>
                <input
                    id="name"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="Nombre del Producto"
                    {...register("name", {
                        required: "El nombre del producto es obligatorio",
                    })}
                />

                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="price" className="text-sm uppercase font-bold">
                    Precio
                </label>
                <input
                    id="price"
                    className="w-full p-3  border border-gray-200"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price", {
                        required: "El precio es obligatorio",
                    })}
                />

                {errors.price && (
                    <ErrorMessage>{errors.price.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <textarea
                    id="description"
                    className="w-full p-3  border border-gray-200"
                    placeholder="Descripción del Proyecto"
                    {...register("description", {
                        required: "Una descripción del proyecto es obligatoria"
                    })}
                />

                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}