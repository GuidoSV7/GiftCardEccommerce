
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
    
    // Estados para los modales de HTML
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    
    // Estados para el contenido HTML temporal
    const [tempDescription, setTempDescription] = useState('');
    const [tempRedeem, setTempRedeem] = useState('');
    const [tempTerms, setTempTerms] = useState('');
    
    const queryClient = useQueryClient();
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });


    const imageUrl = useWatch({
        control,
        name: "imageUrl"
    });

    const description = useWatch({
        control,
        name: "description"
    });

    const redeem = useWatch({
        control,
        name: "redeem"
    });

    const termsConditions = useWatch({
        control,
        name: "termsConditions"
    });



    // Funciones para abrir modales
    const openDescriptionModal = () => {
        setTempDescription(description || '');
        setShowDescriptionModal(true);
    };

    const openRedeemModal = () => {
        setTempRedeem(redeem || '');
        setShowRedeemModal(true);
    };

    const openTermsModal = () => {
        setTempTerms(termsConditions || '');
        setShowTermsModal(true);
    };

    // Funciones para guardar cambios
    const saveDescription = () => {
        setValue("description", tempDescription);
        setShowDescriptionModal(false);
    };

    const saveRedeem = () => {
        setValue("redeem", tempRedeem);
        setShowRedeemModal(false);
    };

    const saveTerms = () => {
        setValue("termsConditions", tempTerms);
        setShowTermsModal(false);
    };



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
            await createCategory({ name: newCategoryName.trim(), state: true });
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
            {/* Inputs ocultos para los campos HTML */}
            <input
                type="hidden"
                {...register("description", {
                    required: "La descripción del producto es obligatoria"
                })}
            />
            <input
                type="hidden"
                {...register("redeem", {
                    required: "Las instrucciones de redención son obligatorias"
                })}
            />
            <input
                type="hidden"
                {...register("termsConditions", {
                    required: "Los términos y condiciones son obligatorios"
                })}
            />

            {/* Botones para editar contenido HTML */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Contenido HTML del Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={openDescriptionModal}
                        className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Descripción
                    </button>
                    <button
                        type="button"
                        onClick={openRedeemModal}
                        className="flex items-center justify-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Instrucciones
                    </button>
                    <button
                        type="button"
                        onClick={openTermsModal}
                        className="flex items-center justify-center gap-2 p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Términos
                    </button>
                </div>
            </div>

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
                        categories?.map((category: { id: string; name: string }) => (
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

            {/* Modal para editar Descripción */}
            {showDescriptionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Editar Descripción</h3>
                                <p className="text-sm text-gray-600 mt-1">Escribe el contenido HTML de la descripción del producto</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDescriptionModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0">
                            <div className="space-y-3 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Editor HTML</label>
                                <textarea
                                    value={tempDescription}
                                    onChange={(e) => setTempDescription(e.target.value)}
                                    className="w-full h-[60vh] p-4 border-2 border-gray-300 rounded-lg font-mono text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all overflow-y-auto"
                                    placeholder="<h3>Descripción del Producto</h3>&#10;<p>Descripción detallada...</p>&#10;<ul>&#10;  <li>Característica 1</li>&#10;  <li>Característica 2</li>&#10;</ul>"
                                />
                            </div>
                            <div className="space-y-3 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Vista Previa</label>
                                <div className="w-full h-[60vh] border-2 border-gray-200 rounded-lg p-4 bg-white overflow-y-auto shadow-inner">
                                    {tempDescription ? (
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: tempDescription }}
                                            style={{
                                                '--image-error-bg': '#f3f4f6',
                                                '--image-error-color': '#6b7280'
                                            } as React.CSSProperties}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[200px]">
                                            <p className="text-gray-400 text-center">
                                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Escribe HTML para ver la vista previa
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => setShowDescriptionModal(false)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={saveDescription}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Guardar Descripción
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar Instrucciones de Redención */}
            {showRedeemModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Editar Instrucciones de Redención</h3>
                                <p className="text-sm text-gray-600 mt-1">Escribe las instrucciones paso a paso para que el usuario pueda canjear su producto</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowRedeemModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0">
                            <div className="space-y-3 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Editor HTML</label>
                                <textarea
                                    value={tempRedeem}
                                    onChange={(e) => setTempRedeem(e.target.value)}
                                    className="w-full h-[60vh] p-4 border-2 border-gray-300 rounded-lg font-mono text-sm resize-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all overflow-y-auto"
                                    placeholder="<h3>Cómo canjear tu código:</h3>&#10;<ol>&#10;  <li>Ve a la página de canje</li>&#10;  <li>Ingresa tu código</li>&#10;  <li>¡Disfruta!</li>&#10;</ol>"
                                />
                            </div>
                            <div className="space-y-3 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Vista Previa</label>
                                <div className="w-full h-[60vh] border-2 border-gray-200 rounded-lg p-4 bg-white overflow-y-auto shadow-inner">
                                    {tempRedeem ? (
                                        <div dangerouslySetInnerHTML={{ __html: tempRedeem }} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[200px]">
                                            <p className="text-gray-400 text-center">
                                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Escribe HTML para ver la vista previa
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => setShowRedeemModal(false)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={saveRedeem}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Guardar Instrucciones
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar Términos y Condiciones */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Editar Términos y Condiciones</h3>
                                <p className="text-sm text-gray-600 mt-1">Define las condiciones legales y restricciones del producto</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0">
                            <div className="space-y-3 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Editor HTML</label>
                                <textarea
                                    value={tempTerms}
                                    onChange={(e) => setTempTerms(e.target.value)}
                                    className="w-full h-[60vh] p-4 border-2 border-gray-300 rounded-lg font-mono text-sm resize-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all overflow-y-auto"
                                    placeholder="<h3>Términos y Condiciones</h3>&#10;<ul>&#10;  <li>Válido por 1 año</li>&#10;  <li>Solo en Estados Unidos</li>&#10;</ul>&#10;<table>&#10;  <tr><th>Restricción</th><th>Detalle</th></tr>&#10;  <tr><td>Región</td><td>US</td></tr>&#10;</table>"
                                />
                            </div>
                            <div className="space-y-3 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Vista Previa</label>
                                <div className="w-full h-[60vh] border-2 border-gray-200 rounded-lg p-4 bg-white overflow-y-auto shadow-inner">
                                    {tempTerms ? (
                                        <div dangerouslySetInnerHTML={{ __html: tempTerms }} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[200px]">
                                            <p className="text-gray-400 text-center">
                                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Escribe HTML para ver la vista previa
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={saveTerms}
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Guardar Términos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}