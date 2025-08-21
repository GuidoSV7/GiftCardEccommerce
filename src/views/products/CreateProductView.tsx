import { useForm } from "react-hook-form";


export default function CreateProductView() {

    const initialValues = {
        name: "",
        description: "",
        price: 0
       
    }


    const {register, handleSubmit, formState: { errors }} = useForm({defaultValues: initialValues});

    const handleForm = (data: any) => {
        console.log(data);
    }

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-2">Crear Nuevo Producto</h1>
          <p className="text-xl font-light text-gray-500">Completa el siguiente formulario para crear un nuevo producto.</p>
        </div>

        
        <div className="bg-gray-50 p-4 rounded-md">
            <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >

                <input type="submit"
                    value="Crear Producto"
                    className="bg-blue-500 hover:bg-blue-600 w-full p-3 text-white uppercase font-bold
                    cursor-pointer transition-colors"
                />

            </form>
          
        </div>
      </div>
    </div>
  )
}
       

