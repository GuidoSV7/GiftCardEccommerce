import React, { useState } from 'react';
import HomeHeader from '../components/home/HomeHeader';
import MemberSidebar from '../components/member/MemberSidebar';
import { HomeFooter } from '../components/home/HomeFooter';

const MyCardsView: React.FC = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Aquí iría la validación de la contraseña con el backend
      // Por ahora simulamos una validación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular validación (en producción esto sería una llamada al API)
      if (password === '123456') {
        // Contraseña correcta - mostrar tarjetas
        console.log('Contraseña correcta, mostrando tarjetas');
        setIsPasswordModalOpen(false);
        setPassword('');
        // Aquí se cargarían las tarjetas del usuario
      } else {
        setError('Contraseña incorrecta. Intenta nuevamente.');
      }
    } catch (error) {
      setError('Error al validar la contraseña. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  return (
    <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gray-900">
      <HomeHeader />
      
      <div className="w-full pt-20 md:pt-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <MemberSidebar />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">Mis Tarjetas</h1>
                
                {/* Botón para acceder a las tarjetas */}
                <div className="bg-gray-800 rounded-xl p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">Acceder a Mis Tarjetas</h3>
                  <p className="text-gray-400 mb-6">Para ver tus códigos y PINs, necesitamos verificar tu identidad</p>
                  
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Ver Mis Tarjetas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-6">
        <HomeFooter />
      </div>

      {/* Modal de validación de contraseña */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative">
            {/* Modal content */}
            <div className="p-8">
              {/* Título */}
              <h2 className="text-2xl font-bold text-white text-center mb-6">Verificar Identidad</h2>
              
              {/* Descripción */}
              <p className="text-gray-300 text-center mb-8">
                Para acceder a tus códigos/PIN, por favor ingresa la contraseña de tu cuenta VemperGames.
              </p>
              
              {/* Campo de contraseña */}
              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ingresa tu contraseña"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>
              
              {/* Botón Enviar */}
              <button
                onClick={handlePasswordSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Validando...
                  </>
                ) : (
                  'ENVIAR'
                )}
              </button>
              
              {/* Botón cancelar */}
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPassword('');
                  setError('');
                }}
                className="w-full mt-3 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCardsView;
