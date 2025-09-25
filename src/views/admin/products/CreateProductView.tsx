import { useForm } from "react-hook-form";

import type { ProductFormData } from "../../../types";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../services/productService";
import ProductForm from '../../../components/dashboard/products/ProductForm';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";


export default function CreateProductView() {

    const navigate = useNavigate();

    const initialValues: ProductFormData = {
        title: "",
        description: "",
        squareImageUrl: "",
        rectangularImageUrl: "",
        smallSquareImageUrl: "",
        redeem: "",
        termsConditions: "",
        purchaseCost: 0,
        state: true,  
        categoryId: "0"
    }


    const {register, handleSubmit, control, setValue, formState: { errors }} = useForm({defaultValues: initialValues});

    const mutation = useMutation({
        mutationFn: createProduct,
        onError: (error: any) => {
            // Manejar errores de Axios
            if (error.response?.data?.message) {
                // Si es un array de mensajes de error
                if (Array.isArray(error.response.data.message)) {
                    error.response.data.message.forEach((msg: string) => {
                        toast.error(msg);
                    });
                } else {
                    // Si es un solo mensaje de error
                    toast.error(error.response.data.message);
                }
            } else {
                // Error genérico
                toast.error('Error al crear el producto');
            }
        },
        onSuccess: (createdProduct) => {
            toast.success('Producto creado exitosamente');
            // Redirigir a la vista de configuración de precios
            navigate(`/products/pricing/${createdProduct.id}`);
        }
    });

    const handleForm = async (formdata: ProductFormData) => {
        console.log('=== INICIO handleForm ===');
        console.log('Formulario enviado con datos:', formdata);
        console.log('Errores del formulario:', errors);
        
        try {
            console.log('Iniciando mutación...');
            const result = await mutation.mutateAsync(formdata);
            console.log('Mutación exitosa:', result);
        } catch (error) {
            // El error ya será manejado por el onError del mutation
            console.error('Error en el formulario:', error);
            // Evitamos que se redirija en caso de error
            return;
        }
        console.log('=== FIN handleForm ===');
    }

  return (
    <div className="container mx-auto">
      <div className=" rounded-lg p-4">
        <div>
          <h1 className="text-4xl font-black text-gray-800 ">Crear Nuevo Producto</h1>
          <p className="text-xl font-light text-gray-500">Completa el siguiente formulario para crear un nuevo producto.</p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-blue-800">
                <p className="font-semibold mb-2">Proceso de creación:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Completa la información básica del producto (título, imagen, categoría)</li>
                  <li>Al crear el producto, serás redirigido automáticamente a la vista de precios</li>
                  <li>En la vista de precios podrás configurar precios, ofertas y descuentos</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-gray-50 p-4 rounded-md">
            <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                noValidate
            >

                <ProductForm
                    register={register}
                    control={control}
                    setValue={setValue}
                    errors={errors}
                    isEditMode={false}
                />

                <button type="button"
                    onClick={async () => {
                        console.log('Botón clickeado - iniciando validación');
                        console.log('Valores actuales del formulario:', control._formValues);
                        console.log('Errores actuales:', errors);
                        
                        // Verificar campos requeridos manualmente
                        const formValues = control._formValues;
                        const missingFields = [];
                        
                        if (!formValues.title) missingFields.push('title');
                        if (!formValues.purchaseCost || formValues.purchaseCost <= 0) missingFields.push('purchaseCost');
                        if (!formValues.categoryId || formValues.categoryId === "0") missingFields.push('categoryId');
                        
                        // Las imágenes son opcionales, pero al menos una debe estar presente
                        if (!formValues.squareImageUrl && !formValues.rectangularImageUrl && !formValues.smallSquareImageUrl) {
                            missingFields.push('al menos una imagen');
                        }
                        
                        // Los campos description, redeem y termsConditions son opcionales
                        
                        if (missingFields.length > 0) {
                            console.error('Campos faltantes:', missingFields);
                            toast.error(`Por favor completa los siguientes campos: ${missingFields.join(', ')}`);
                            return;
                        }
                        
                        const isValid = await handleSubmit(handleForm)();
                        console.log('Validación completada:', isValid);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 w-full p-3 text-white uppercase font-bold
                    cursor-pointer transition-colors"
                >
                    Crear producto
                </button>

            </form>
          
        </div>
      </div>
    </div>
  )
}
       

