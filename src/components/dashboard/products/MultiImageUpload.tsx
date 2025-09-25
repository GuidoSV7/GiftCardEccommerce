import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { uploadImage } from '../../../services/fileService';

interface MultiImageUploadProps {
    squareImageUrl?: string;
    rectangularImageUrl?: string;
    smallSquareImageUrl?: string;
    onImageChange: (type: 'square' | 'rectangular' | 'smallSquare', url: string) => void;
    errors?: {
        squareImageUrl?: string;
        rectangularImageUrl?: string;
        smallSquareImageUrl?: string;
    };
}

export default function MultiImageUpload({ 
    squareImageUrl, 
    rectangularImageUrl, 
    smallSquareImageUrl, 
    onImageChange, 
    errors 
}: MultiImageUploadProps) {
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent, type: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(type);
        } else if (e.type === "dragleave") {
            setDragActive(null);
        }
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent, type: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(null);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFileUpload(e.dataTransfer.files[0], type);
        }
    }, []);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        if (e.target.files && e.target.files[0]) {
            await handleFileUpload(e.target.files[0], type);
        }
    }, []);

    const handleFileUpload = async (file: File, type: string) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona un archivo de imagen válido');
            return;
        }

        setIsUploading(type);
        try {
            const response = await uploadImage(file);
            onImageChange(type as 'square' | 'rectangular' | 'smallSquare', response.imageUrls[0]);
            toast.success(`${getImageTypeLabel(type)} subida exitosamente`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al subir la imagen';
            toast.error(errorMessage);
        } finally {
            setIsUploading(null);
        }
    };

    const getImageTypeLabel = (type: string) => {
        switch (type) {
            case 'image': return 'Imagen principal';
            case 'square': return 'Imagen cuadrada';
            case 'rectangular': return 'Imagen rectangular';
            case 'smallSquare': return 'Imagen cuadrada pequeña';
            default: return 'Imagen';
        }
    };

    const getImageTypeDescription = (type: string) => {
        switch (type) {
            case 'square': return 'Imagen cuadrada (1:1) - Para tarjetas y vistas principales';
            case 'rectangular': return 'Imagen rectangular (16:9) - Para banners y vistas amplias';
            case 'smallSquare': return 'Imagen cuadrada pequeña (1:1) - Para miniaturas y listas';
            default: return 'Imagen del producto';
        }
    };

    const getCurrentImage = (type: string) => {
        switch (type) {
            case 'square': return squareImageUrl || '';
            case 'rectangular': return rectangularImageUrl || '';
            case 'smallSquare': return smallSquareImageUrl || '';
            default: return '';
        }
    };

    const getError = (type: string) => {
        switch (type) {
            case 'square': return errors?.squareImageUrl;
            case 'rectangular': return errors?.rectangularImageUrl;
            case 'smallSquare': return errors?.smallSquareImageUrl;
            default: return undefined;
        }
    };

    const renderImageUpload = (type: string) => {
        const currentImage = getCurrentImage(type);
        const error = getError(type);
        const isCurrentlyUploading = isUploading === type;
        const isDragActive = dragActive === type;

        return (
            <div key={type} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {getImageTypeLabel(type)}
                </label>
                <p className="text-xs text-gray-500 mb-2">
                    {getImageTypeDescription(type)}
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Zona de drag & drop */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                            isDragActive 
                                ? 'border-blue-400 bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        } ${isCurrentlyUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onDragEnter={(e) => handleDrag(e, type)}
                        onDragLeave={(e) => handleDrag(e, type)}
                        onDragOver={(e) => handleDrag(e, type)}
                        onDrop={(e) => handleDrop(e, type)}
                        onClick={() => !isCurrentlyUploading && document.getElementById(`file-input-${type}`)?.click()}
                    >
                        <input
                            id={`file-input-${type}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, type)}
                            className="hidden"
                            disabled={isCurrentlyUploading}
                        />
                        
                        {isCurrentlyUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
                                <p className="text-xs text-gray-600">Subiendo...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-xs text-gray-600">
                                    <span className="font-semibold">Haz clic</span> o arrastra
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                            </div>
                        )}
                    </div>

                    {/* Preview de la imagen */}
                    <div className="flex items-center justify-center">
                        {currentImage ? (
                            <div className="relative">
                                <img
                                    src={currentImage}
                                    alt={`Preview ${type}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/200x128?text=Error+al+cargar';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => onImageChange(type as 'square' | 'rectangular' | 'smallSquare', "")}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <p className="text-gray-500 text-xs">Vista previa</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {error && (
                    <div className="text-red-500 text-xs mt-1">{error}</div>
                )}
            </div>
        );
    };

    return (
        <div className="mb-6 space-y-6">
            <div className="mb-4">
                <h3 className="text-sm uppercase font-bold text-gray-700 mb-2">
                    Imágenes del Producto
                </h3>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Tipos de imágenes disponibles (opcionales):</p>
                            <ul className="text-xs space-y-1">
                                <li>• <strong>Cuadrada:</strong> Para tarjetas de producto y vistas principales</li>
                                <li>• <strong>Rectangular:</strong> Para banners y vistas amplias</li>
                                <li>• <strong>Cuadrada pequeña:</strong> Para miniaturas y listas de productos</li>
                            </ul>
                            <p className="text-xs mt-2 text-blue-600">
                                <strong>Nota:</strong> Todas las imágenes son opcionales. Puedes subir solo las que necesites.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {renderImageUpload('square')}
                {renderImageUpload('rectangular')}
                {renderImageUpload('smallSquare')}
            </div>
        </div>
    );
}
