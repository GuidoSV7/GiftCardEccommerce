

export default function DashboardView() {
  return (
    <div className="container mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-2">Mis Productos</h1>
          <p className="text-xl font-light text-gray-500">Maneja y Administra tus productos</p>
        </div>

        {/* Aquí puedes agregar una tabla o grid de productos */}
        <div className="bg-gray-50 p-4 rounded-md">
          {/* Contenido de productos irá aquí */}
        </div>
      </div>
    </div>
  )
}
