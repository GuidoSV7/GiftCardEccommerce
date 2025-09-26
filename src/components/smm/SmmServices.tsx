import React from 'react';

export const SmmServices: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Servicios SMM</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Servicios SMM</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aquí se mostrarán los servicios de redes sociales disponibles.
          </p>
        </div>
      </div>
    </div>
  );
};
