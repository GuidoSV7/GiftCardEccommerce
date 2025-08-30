import { useForm } from "react-hook-form";
import ProductForm from "../../components/dashboard/gifcards/GifcardForm";
import type { GifcardFormData } from "../../types";


export default function CreateProductView() {

    const initialValues: GifcardFormData = {
        title: "",
        description: "",
        price: 0,
        imageUrl: "",
        state: true,
    }


    const {register, handleSubmit, formState: { errors }} = useForm({defaultValues: initialValues});

    const handleForm = (data: GifcardFormData) => {
        console.log(data);
    }

  return (
    <div className="container mx-auto">
      <div className=" rounded-lg p-4">
        <div>
          <h1 className="text-4xl font-black text-gray-800 ">Crear Nuevo Gifcard</h1>
          <p className="text-xl font-light text-gray-500">Completa el siguiente formulario para crear un nuevo gifcard.</p>
        </div>

        
        <div className="bg-gray-50 p-4 rounded-md">
            <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >

                <ProductForm
                    register={register}
                    errors={errors}
                />

                <input type="submit"
                    value="Crear gifcard"
                    className="bg-blue-500 hover:bg-blue-600 w-full p-3 text-white uppercase font-bold
                    cursor-pointer transition-colors"
                />

            </form>
          
        </div>
      </div>
    </div>
  )
}
       

