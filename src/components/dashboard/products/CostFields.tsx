import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { ProductFormData } from '../../../types';

interface CostFieldsProps {
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
}

export default function CostFields({ register, errors }: CostFieldsProps) {
    return (
        <div className="mb-5 space-y-4">
            <h3 className="text-sm uppercase font-bold text-gray-700">
                Costo del Producto
            </h3>
            
            <div className="max-w-md">
                {/* Costo de Compra */}
                <div className="space-y-2">
                    <label htmlFor="purchaseCost" className="text-sm font-medium text-gray-700">
                        Costo de Compra *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            id="purchaseCost"
                            {...register("purchaseCost", {
                                required: "El costo de compra es obligatorio",
                                min: { value: 0, message: "El costo debe ser mayor o igual a 0" }
                            })}
                            className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                errors.purchaseCost ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.purchaseCost && (
                        <p className="text-red-500 text-xs mt-1">{errors.purchaseCost.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        Costo al que compras el producto al proveedor
                    </p>
                </div>
            </div>

            {/* Información adicional */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Información de precios:</p>
                        <ul className="text-xs space-y-1">
                            <li>• El <strong>costo de compra</strong> es lo que pagas al proveedor</li>
                            <li>• Los <strong>precios de venta</strong> se configuran en la sección de precios</li>
                            <li>• Puedes tener múltiples precios para diferentes regiones o promociones</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
