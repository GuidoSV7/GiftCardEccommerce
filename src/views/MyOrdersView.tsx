import React from 'react';
import HomeHeader from '../components/home/HomeHeader';
import MemberSidebar from '../components/member/MemberSidebar';
import { HomeFooter } from '../components/home/HomeFooter';

const MyOrdersView: React.FC = () => {
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
                <h1 className="text-3xl font-bold mb-6 text-white">Mis Pedidos</h1>
                
                {/* Orders Table */}
                <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      {/* Table Header */}
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Orden #</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Fecha</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Tarjetas de regalo</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Estado del pedido</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Comportamiento</th>
                        </tr>
                      </thead>
                      
                      {/* Table Body */}
                      <tbody className="divide-y divide-gray-700">
                        {/* Order 1 */}
                        <tr className="hover:bg-gray-700 transition-colors duration-200">
                          <td className="py-4 px-6">
                            <span className="text-blue-400 font-medium cursor-pointer hover:text-blue-300 transition-colors duration-200">#4539331</span>
                          </td>
                          <td className="py-4 px-6 text-gray-300">13 de julio de 2024</td>
                          <td className="py-4 px-6 text-gray-300">Tarjeta de regalo Binance USDT</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/50 text-green-300 border border-green-600/30">
                              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Pedido completo
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                                Ver códigos
                              </button>
                              <button className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-600 text-blue-300 border border-gray-500 hover:bg-gray-500 hover:text-blue-200 transition-colors duration-200">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Reordenar
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Order 2 */}
                        <tr className="hover:bg-gray-700 transition-colors duration-200">
                          <td className="py-4 px-6">
                            <span className="text-blue-400 font-medium cursor-pointer hover:text-blue-300 transition-colors duration-200">#4226579</span>
                          </td>
                          <td className="py-4 px-6 text-gray-300">23 de febrero de 2024</td>
                          <td className="py-4 px-6 text-gray-300">Tarjeta de regalo Binance USDT</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/50 text-green-300 border border-green-600/30">
                              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Pedido completo
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                                Ver códigos
                              </button>
                              <button className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-600 text-blue-300 border border-gray-500 hover:bg-gray-500 hover:text-blue-200 transition-colors duration-200">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Reordenar
                              </button>
                            </div>
                          </td>
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
      
      {/* Footer */}
      <div className="pt-6">
        <HomeFooter />
      </div>
    </div>
  );
};

export default MyOrdersView;
