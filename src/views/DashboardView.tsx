

import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function DashboardView() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: ''
  });

  // Función para generar un nombre amigable
  const generateFriendlyName = (email: string) => {
    const username = email.split('@')[0];
    // Capitalizar la primera letra y reemplazar puntos/guiones con espacios
    return username
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Cargar datos del usuario logueado
  useEffect(() => {
    if (user && isAuthenticated) {
      setUserData({
        name: generateFriendlyName(user.email),
        email: user.email,
        role: user.rol === 'admin' ? 'Administrador' : 'Miembro'
      });
    }
  }, [user, isAuthenticated]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarías la lógica para guardar los cambios
    console.log('Guardando perfil:', userData);
    setEditModalOpen(false);
  };

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No autenticado</h2>
          <p className="text-gray-600">Por favor inicia sesión para acceder al dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Bienvenida y Perfil del Usuario - Centrado */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-white">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Avatar del usuario */}
          <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {/* Información del usuario */}
          <div>
            <h1 className="text-4xl font-bold mb-3">
              ¡Bienvenido de vuelta, {userData.name || 'Usuario'}!
            </h1>
            <p className="text-blue-100 text-xl mb-4">{userData.email || 'Cargando...'}</p>
            <div className="flex items-center justify-center space-x-6 text-blue-100">
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Último acceso: {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rol: {userData.role || 'Cargando...'}
              </span>
            </div>
          </div>
          
          {/* Acciones rápidas */}
          <div className="flex space-x-4">
            <button 
              onClick={() => setEditModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Perfil */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-sm mx-4 relative shadow-xl">
            {/* Botón de cerrar */}
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Editar Perfil</h2>
              <p className="text-sm text-gray-600">Actualiza tu información</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveProfile} className="space-y-3">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  placeholder="Ingresa tu email"
                  required
                />
              </div>

              {/* Rol (Solo lectura) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <input
                  type="text"
                  value={userData.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-0.5">No modificable</p>
              </div>

              {/* Botones */}
              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

