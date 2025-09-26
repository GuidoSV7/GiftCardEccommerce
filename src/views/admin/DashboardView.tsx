

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

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
    if (!email) return 'Usuario';
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
        name: generateFriendlyName(user.email || ''),
        email: user.email || '',
        role: user.roles === 'admin' ? 'Administrador' : 'Miembro'
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
      {/* Header de Bienvenida Simplificado */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between space-y-6 lg:space-y-0">
          
          {/* Información del usuario */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6 text-center lg:text-left">
            {/* Avatar */}
            <div className="h-20 w-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            {/* Información del usuario */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                ¡Bienvenido, {userData.name || 'Usuario'}!
              </h1>
              <p className="text-blue-100 text-lg mb-3">{userData.email || 'Cargando...'}</p>
              
              {/* Badge del rol */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <svg className="h-4 w-4 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-medium">{userData.role || 'Cargando...'}</span>
              </div>
            </div>
          </div>
          
          {/* Botón de editar perfil */}
          <div>
            <button 
              onClick={() => setEditModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/30 hover:border-white/50 flex items-center space-x-2 text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editar Perfil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Perfil */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md mx-4 relative shadow-2xl border border-white/30">
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
            <div className="text-center mb-6">
              <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Editar Perfil</h2>
              <p className="text-gray-600">Actualiza tu información personal</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>

              {/* Rol (Solo lectura) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol del Usuario
                </label>
                <input
                  type="text"
                  value={userData.role}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/80 text-gray-500 cursor-not-allowed backdrop-blur-sm"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Este campo no se puede modificar</p>
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

