
import { type FieldErrors, type UseFormRegister, useWatch, type Control } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { ProductFormData } from '../../../types';
import { getCategories } from '../../../services/categoryService';
import HtmlEditorModal from './HtmlEditorModal';
import MultiImageUpload from './MultiImageUpload';
import CategoryModal from './CategoryModal';
import HtmlContentButtons from './HtmlContentButtons';
import { TitleField, StateField, CategoryField } from './FormField';
import ProductPricing from './ProductPricing';
import CostFields from './CostFields';

type ProductFormProps = {
    register: UseFormRegister<ProductFormData>
    control: Control<ProductFormData>
    setValue: (name: keyof ProductFormData, value: any) => void
    errors: FieldErrors<ProductFormData>
    productId?: string
    isEditMode?: boolean
}

export default function ProductForm({ register, control, setValue, errors, productId, isEditMode = false }: ProductFormProps) {
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    
    // Estados para los modales de HTML
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    
    const queryClient = useQueryClient();
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });


    const squareImageUrl = useWatch({
        control,
        name: "squareImageUrl"
    });

    const rectangularImageUrl = useWatch({
        control,
        name: "rectangularImageUrl"
    });

    const smallSquareImageUrl = useWatch({
        control,
        name: "smallSquareImageUrl"
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
        setShowDescriptionModal(true);
    };

    const openRedeemModal = () => {
        setShowRedeemModal(true);
    };

    const openTermsModal = () => {
        setShowTermsModal(true);
    };

    // Funciones para guardar cambios
    const saveDescription = (content: string) => {
        setValue("description", content);
    };

    const saveRedeem = (content: string) => {
        setValue("redeem", content);
    };

    const saveTerms = (content: string) => {
        setValue("termsConditions", content);
    };

    const handleCategoryCreated = () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
    };





    return (
        <>
            {/* Inputs ocultos para los campos HTML */}
            <input
                type="hidden"
                {...register("description")}
            />
            <input
                type="hidden"
                {...register("redeem")}
            />
            <input
                type="hidden"
                {...register("termsConditions")}
            />
                    <input
                        type="hidden"
                        {...register("squareImageUrl")}
                    />
                    <input
                        type="hidden"
                        {...register("rectangularImageUrl")}
                    />
                    <input
                        type="hidden"
                        {...register("smallSquareImageUrl")}
                    />
                    
            {/* Botones para editar contenido HTML */}
            <div className="mb-4">
                <HtmlContentButtons
                    onEditDescription={openDescriptionModal}
                    onEditRedeem={openRedeemModal}
                    onEditTerms={openTermsModal}
                />
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">
                            Los campos de contenido HTML son opcionales. Puedes editarlos usando los botones de arriba si deseas agregar contenido personalizado.
                        </p>
                    </div>
                </div>
            </div>

            {/* Campos del formulario */}
            <TitleField register={register} errors={errors} />
            
            <MultiImageUpload
                squareImageUrl={squareImageUrl}
                rectangularImageUrl={rectangularImageUrl}
                smallSquareImageUrl={smallSquareImageUrl}
                onImageChange={(type, url) => {
                    if (type === 'square') setValue("squareImageUrl", url);
                    if (type === 'rectangular') setValue("rectangularImageUrl", url);
                    if (type === 'smallSquare') setValue("smallSquareImageUrl", url);
                }}
                errors={{
                    squareImageUrl: errors.squareImageUrl?.message,
                    rectangularImageUrl: errors.rectangularImageUrl?.message,
                    smallSquareImageUrl: errors.smallSquareImageUrl?.message,
                }}
            />

            <CostFields register={register} errors={errors} />

            <StateField register={register} />

            <CategoryField
                register={register}
                errors={errors}
                categories={categories}
                categoriesLoading={categoriesLoading}
                onShowCategoryModal={() => setShowCategoryModal(true)}
            />

            {/* Gestión de Precios - Solo en modo edición */}
            {isEditMode && productId ? (
                <ProductPricing
                    productId={productId}
                    isEditMode={isEditMode}
                />
            ) : (
                <div className="mb-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm uppercase font-bold text-gray-700">
                                Gestión de Precios
                            </h3>
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Configuración de precios:</p>
                                        <p className="text-xs">
                                            Los precios se configurarán después de crear el producto. Una vez creado, podrás agregar múltiples precios, ofertas y descuentos desde la vista de edición.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modales */}
            <CategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onCategoryCreated={handleCategoryCreated}
            />

            <HtmlEditorModal
                isOpen={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                onSave={saveDescription}
                title="Editar Descripción"
                description="Escribe el contenido HTML de la descripción del producto"
                initialContent={description || ''}
                                    placeholder="<h3>Descripción del Producto</h3>&#10;<p>Descripción detallada...</p>&#10;<ul>&#10;  <li>Característica 1</li>&#10;  <li>Característica 2</li>&#10;</ul>"
                color="blue"
            />

            <HtmlEditorModal
                isOpen={showRedeemModal}
                onClose={() => setShowRedeemModal(false)}
                onSave={saveRedeem}
                title="Editar Instrucciones de Redención"
                description="Escribe las instrucciones paso a paso para que el usuario pueda canjear su producto"
                initialContent={redeem || ''}
                                    placeholder="<h3>Cómo canjear tu código:</h3>&#10;<ol>&#10;  <li>Ve a la página de canje</li>&#10;  <li>Ingresa tu código</li>&#10;  <li>¡Disfruta!</li>&#10;</ol>"
                color="green"
            />

            <HtmlEditorModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                onSave={saveTerms}
                title="Editar Términos y Condiciones"
                description="Define las condiciones legales y restricciones del producto"
                initialContent={termsConditions || ''}
                                    placeholder="<h3>Términos y Condiciones</h3>&#10;<ul>&#10;  <li>Válido por 1 año</li>&#10;  <li>Solo en Estados Unidos</li>&#10;</ul>&#10;<table>&#10;  <tr><th>Restricción</th><th>Detalle</th></tr>&#10;  <tr><td>Región</td><td>US</td></tr>&#10;</table>"
                color="yellow"
            />
        </>
    )
}