export default function MembersLoadingState() {
  return (
    <div className="w-full flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando miembros...</p>
      </div>
    </div>
  );
}
