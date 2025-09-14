import { useState } from 'react';
import { toast } from 'react-toastify';
import { createCategory } from '../../../services/categoryService';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoryCreated: () => void;
}

export default function CategoryModal({ isOpen, onClose, onCategoryCreated }: CategoryModalProps) {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Por favor ingresa un nombre para la categoría');
            return;
        }

        try {
            await createCategory({ name: newCategoryName.trim(), state: true });
            toast.success('Categoría creada exitosamente');
            setNewCategoryName('');
            onClose();
            onCategoryCreated();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear la categoría';
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        setNewCategoryName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Crear Nueva Categoría</h3>
                    <button
                        type="button"
                        onClick={handleClose}
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
                        onClick={handleClose}
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
    );
}
