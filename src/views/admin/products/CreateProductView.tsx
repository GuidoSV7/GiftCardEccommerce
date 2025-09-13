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
        imageUrl: "",
        redeem: "",
        termsConditions: "",
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
        onSuccess: () => {
            toast.success('Producto creado exitosamente');
            navigate("/dashboard");
        }
    });

    const handleForm = async (formdata: ProductFormData) => {
        try {
            await mutation.mutateAsync(formdata);
        } catch (error) {
            // El error ya será manejado por el onError del mutation
            console.error('Error en el formulario:', error);
            // Evitamos que se redirija en caso de error
            return;
        }
    }

  return (
    <div className="container mx-auto">
      <div className=" rounded-lg p-4">
        <div>
          <h1 className="text-4xl font-black text-gray-800 ">Crear Nuevo Producto</h1>
          <p className="text-xl font-light text-gray-500">Completa el siguiente formulario para crear un nuevo producto.</p>
        </div>

        
        <div className="bg-gray-50 p-4 rounded-md">
            <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >

                <ProductForm
                    register={register}
                    control={control}
                    setValue={setValue}
                    errors={errors}
                />

                <input type="submit"
                    value="Crear producto"
                    className="bg-blue-500 hover:bg-blue-600 w-full p-3 text-white uppercase font-bold
                    cursor-pointer transition-colors"
                />

            </form>
          
        </div>
      </div>
    </div>
  )
}
       

