import React, { useState } from 'react';
import HomeHeader from '../components/home/HomeHeader';
import MemberSidebar from '../components/member/MemberSidebar';
import { HomeFooter } from '../components/home/HomeFooter';

const VemperAffiliatesView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
                <h1 className="text-3xl font-bold mb-6 text-white">Vemper Affiliates</h1>
                
                {/* Transparent Container for Cards and Button */}
                <div className="bg-transparent rounded-lg p-6 mb-8">
                  {/* Top Section - Cards and Button */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section - Two Cards */}
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Card - Dollars */}
                        <div className="bg-white rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-yellow-400 text-xl font-bold">$</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-800 mb-1">$ 10.00</div>
                          <div className="text-gray-600 text-sm">DOLARES EN PUNTOS</div>
                        </div>
                        
                        {/* Middle Card - Points */}
                        <div className="bg-white rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white text-xl">📈</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-800 mb-1">P. 5.00</div>
                          <div className="text-gray-600 text-sm">PUNTOS GANADOS</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Section - Withdraw Button */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-full">
                        <button 
                          onClick={openModal}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg transition-colors duration-200"
                        >
                          RETIRAR SALDO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Section - Points History */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">HISTORIAL DE PUNTOS</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4">TIEMPO</th>
                          <th className="text-left py-3 px-4">TRANSACCION</th>
                          <th className="text-left py-3 px-4">CREDITO EN/SALIDA</th>
                          <th className="text-left py-3 px-4">SALDO</th>
                          <th className="text-left py-3 px-4">NOTA</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-700">
                          <td className="py-3 px-4 text-gray-300">2022-12-16 03:04:54</td>
                          <td className="py-3 px-4 text-gray-300">Pago en línea</td>
                          <td className="py-3 px-4 text-red-400">-1,00</td>
                          <td className="py-3 px-4 text-gray-300">0</td>
                          <td className="py-3 px-4 text-gray-300">RETIRO DE SALDO</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-gray-300">2024-12-16 03:04:54</td>
                          <td className="py-3 px-4 text-gray-300">Recarga saldo</td>
                          <td className="py-3 px-4 text-green-400">1,00</td>
                          <td className="py-3 px-4 text-gray-300">1</td>
                          <td className="py-3 px-4 text-gray-300">PUNTO DE RECARGA</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Solicitar Retiro</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="space-y-4">
              {/* Amount to Withdraw */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto a Retirar
                </label>
                <input
                  type="text"
                  defaultValue="$ 0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Monto minimo: $10.00 | Disponible: $10.30
                </p>
              </div>
              
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              
              {/* Payment Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalles de Pago
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              
              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  placeholder=""
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                Solicitar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="pt-6">
        <HomeFooter />
      </div>
    </div>
  );
};

export default VemperAffiliatesView;
