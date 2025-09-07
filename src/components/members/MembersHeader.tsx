import { Link } from 'react-router-dom';

export default function MembersHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Miembros</h1>
        <p className="text-gray-600 mt-1">Gestiona los miembros del sistema</p>
      </div>
      <Link
        to="/members/create"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Crear Miembro
      </Link>
    </div>
  );
}
