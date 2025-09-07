import React from 'react';
import { useCarouselStore } from '../stores/carouselStore';

export default function CarouselLimitModal() {
  const { showLimitModal, hideLimitModal, maxItems } = useCarouselStore();

  if (!showLimitModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Icono de advertencia */}
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Contenido */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Límite del Carrusel Alcanzado
            </h3>
            <p className="text-gray-600 mb-6">
              Solo puedes seleccionar un máximo de <span className="font-semibold text-blue-600">{maxItems} elementos</span> para el carrusel.
              <br />
              <br />
              Deselecciona algún elemento antes de agregar uno nuevo.
            </p>

            {/* Botón de cerrar */}
            <button
              onClick={hideLimitModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
