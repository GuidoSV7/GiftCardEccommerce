
import { type FieldErrors, type UseFormRegister, useWatch, type Control } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import ErrorMessage from '../../ErrorMessage';
import type { ProductFormData } from '../../../types';
import { getCategories, createCategory } from '../../../services/categoryService';
import { uploadImage } from '../../../services/fileService';

type ProductFormProps = {
    register: UseFormRegister<ProductFormData>
    control: Control<ProductFormData>
    setValue: (name: keyof ProductFormData, value: any) => void
    errors: FieldErrors<ProductFormData>
}

export default function ProductForm({ register, control, setValue, errors }: ProductFormProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    
    const queryClient = useQueryClient();
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const imageUrl = useWatch({
        control,
        name: "imageUrl"
    });

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFileUpload(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleFileUpload(e.target.files[0]);
        }
    }, []);

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona un archivo de imagen válido');
            return;
        }

        setIsUploading(true);
        try {
            const response = await uploadImage(file);
            // Actualizar el campo imageUrl con la primera URL de Cloudinary
            setValue("imageUrl", response.imageUrls[0]);
            toast.success('Imagen subida exitosamente');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al subir la imagen';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Por favor ingresa un nombre para la categoría');
            return;
        }

        try {
            await createCategory({ name: newCategoryName.trim() });
            toast.success('Categoría creada exitosamente');
            setNewCategoryName('');
            setShowCategoryModal(false);
            // Invalidar el cache de categorías para que se actualice la lista
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear la categoría';
            toast.error(errorMessage);
        }
    };

    return (
        <>
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

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <textarea
                    id="description"
                    className="w-full p-3 border border-gray-200 rounded"
                    placeholder="Descripción del producto"
                    {...register("description", {
                        required: "La descripción del producto es obligatoria"
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="imageUrl" className="text-sm uppercase font-bold">
                    Imagen del Producto
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input oculto para imageUrl */}
                    <input
                        type="hidden"
                        {...register("imageUrl", {
                            required: "La imagen es obligatoria"
                        })}
                    />
                    
                    {/* Zona de drag & drop */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                            dragActive 
                                ? 'border-blue-400 bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => !isUploading && document.getElementById('file-input')?.click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isUploading}
                        />
                        
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                                <p className="text-sm text-gray-600">Subiendo imagen...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                            </div>
                        )}
                    </div>

                    {/* Preview de la imagen */}
                    <div className="flex items-center justify-center">
                        {imageUrl ? (
                            <div className="relative">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/200x128?text=Error+al+cargar';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setValue("imageUrl", "")}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <p className="text-gray-500 text-sm">Vista previa de la imagen</p>
                            </div>
                        )}
                    </div>
                </div>
                {errors.imageUrl && (
                    <ErrorMessage>{errors.imageUrl.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="redeem" className="text-sm uppercase font-bold">
                    Instrucciones de Redención
                </label>
                <textarea
                    id="redeem"
                    className="w-full p-3 border border-gray-200 rounded"
                    placeholder="Instrucciones para redimir el producto"
                    {...register("redeem", {
                        required: "Las instrucciones de redención son obligatorias"
                    })}
                />
                {errors.redeem && (
                    <ErrorMessage>{errors.redeem.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="termsConditions" className="text-sm uppercase font-bold">
                    Términos y Condiciones
                </label>
                <textarea
                    id="termsConditions"
                    className="w-full p-3 border border-gray-200 rounded"
                    placeholder="Términos y condiciones del producto"
                    {...register("termsConditions", {
                        required: "Los términos y condiciones son obligatorios"
                    })}
                />
                {errors.termsConditions && (
                    <ErrorMessage>{errors.termsConditions.message}</ErrorMessage>
                )}
            </div>

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

            <div className="mb-5 space-y-3">
                <div className="flex items-center justify-between">
                    <label htmlFor="categoryId" className="text-sm uppercase font-bold">
                        Categoría
                    </label>
                    <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => setShowCategoryModal(true)}
                    >
                        + Crear nueva categoría
                    </button>
                </div>
                <select
                    id="category"
                    className="w-full p-3 border border-gray-200 rounded"
                    disabled={categoriesLoading}
                    {...register("category", {
                        required: "La categoría es obligatoria"
                    })}
                >
                    <option value="">Seleccionar categoría</option>
                    {categoriesLoading ? (
                        <option value="" disabled>Cargando categorías...</option>
                    ) : (
                        categories?.map((category: { id: number; name: string }) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))
                    )}
                </select>
                {errors.category && (
                    <ErrorMessage>{errors.category.message}</ErrorMessage>
                )}
            </div>

            {/* Modal para crear nueva categoría */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Crear Nueva Categoría</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setNewCategoryName('');
                                }}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la categoría
                            </label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Ingresa el nombre de la categoría"
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setNewCategoryName('');
                                }}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}