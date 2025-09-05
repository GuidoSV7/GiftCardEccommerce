import React from 'react';
import HomeHeader from '../components/home/HomeHeader';
import MemberSidebar from '../components/member/MemberSidebar';
import { HomeFooter } from '../components/home/HomeFooter';

const RechargeView: React.FC = () => {
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
                <h1 className="text-3xl font-bold mb-6 text-white">VemperGames Recarga de saldo</h1>
                
                {/* Top Section - Current Balance Display */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-lg">$</span>
                    </div>
                    <span className="text-gray-300 font-medium">Cuenta USD</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Cantidad actual del saldo</p>
                    <p className="text-2xl font-bold text-white">US$ 0.00</p>
                  </div>
                </div>
                
                {/* Bottom Section - Recharge Options */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <p className="text-gray-300 mb-4">Recarga a través de Pago en Línea</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">USD</span>
                      <input 
                        type="text" 
                        defaultValue="5,00"
                        className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                      RECARGAR
                    </button>
                  </div>
                  
                  <p className="text-gray-400 text-sm">Rango de cantidad de recarga: US$ 5.00 ~ US$ 500.00</p>
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

export default RechargeView;
