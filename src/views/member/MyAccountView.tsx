import React from 'react';
import HomeHeader from '../../components/home/HomeHeader';
import MemberSidebar from '../../components/member/MemberSidebar';
import { HomeFooter } from '../../components/home/HomeFooter';
import { useAuthStore } from '../../stores/authStore';

const MyAccountView: React.FC = () => {
  const { user } = useAuthStore();

  // Si no hay usuario logueado, mostrar mensaje
  if (!user) {
    return (
      <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gray-900">
        <HomeHeader />
        <div className="w-full pt-20 md:pt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <p className="text-white text-lg">No hay usuario logueado</p>
            </div>
          </div>
        </div>
        <div className="pt-6">
          <HomeFooter />
        </div>
      </div>
    );
  }

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
                {/* User Profile Card */}
                <div className="bg-gray-900 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{user.email ? user.email.split('@')[0] : 'Usuario'}</h2>
                      </div>
                    </div>
                    <button className="bg-transparent text-white px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors duration-200 flex items-center">
                      <span className="mr-2">⚙️</span>
                      Editar
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Correo electrónico</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                      <div className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full">
                        <span className="mr-2">✔</span>
                        <span className="text-sm font-medium">Verificado</span>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
};

export default MyAccountView;
