import React, { useState } from 'react';
import { HomeFooter } from '../../components/home/HomeFooter';
import HomeHeader from '../../components/home/HomeHeader';
import MemberSidebar from '../../components/member/MemberSidebar';


const MyCouponsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const handleRedeemCoupon = () => {
    // Aquí iría la lógica para canjear el cupón
    console.log('Canjeando cupón:', couponCode);
    setIsModalOpen(false);
    setCouponCode('');
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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">Mis Cupones</h1>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Redimir
                  </button>
                </div>

                {/* Filter */}
                <div className="mb-6">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Recientemente Reclamado
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* No Coupons State */}
                <div className="bg-gray-800 rounded-xl p-12 text-center">
                  <div className="w-64 h-64 mx-auto mb-6 relative">
                    {/* Tiger Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Tiger */}
                      <div className="relative">
                        {/* Tiger body */}
                        <div className="w-32 h-24 bg-orange-400 rounded-full relative">
                          {/* Tiger stripes */}
                          <div className="absolute top-2 left-2 w-8 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-4 left-6 w-6 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-6 left-3 w-7 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-8 left-8 w-5 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-10 left-2 w-6 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-12 left-7 w-4 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-14 left-4 w-5 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-16 left-9 w-3 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-18 left-1 w-7 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-20 left-6 w-4 h-1 bg-black rounded-full"></div>
                        </div>
                        
                        {/* Tiger head */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-orange-400 rounded-full">
                          {/* Eyes */}
                          <div className="absolute top-4 left-3 w-3 h-3 bg-white rounded-full"></div>
                          <div className="absolute top-4 right-3 w-3 h-3 bg-white rounded-full"></div>
                          <div className="absolute top-5 left-4 w-1 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-5 right-4 w-1 h-1 bg-black rounded-full"></div>
                          
                          {/* Nose */}
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full"></div>
                          
                          {/* Mouth */}
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-black rounded-full"></div>
                        </div>
                        
                        {/* Magnifying glass */}
                        <div className="absolute top-2 right-2 w-8 h-8 border-2 border-gray-600 rounded-full">
                          <div className="absolute bottom-0 right-0 w-4 h-1 bg-gray-600 transform rotate-45 origin-left"></div>
                        </div>
                      </div>
                      
                      {/* Computer monitor */}
                      <div className="absolute top-16 left-8 w-16 h-12 bg-gray-600 rounded-lg">
                        <div className="absolute inset-1 bg-blue-100 rounded">
                          <div className="w-full h-1 bg-blue-300 mb-1"></div>
                          <div className="w-3/4 h-1 bg-blue-300 mb-1"></div>
                          <div className="w-1/2 h-1 bg-blue-300"></div>
                        </div>
                      </div>
                      
                      {/* Stars */}
                      <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 transform rotate-45"></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-blue-400 transform rotate-45"></div>
                      <div className="absolute bottom-8 left-12 w-2 h-2 bg-purple-400 transform rotate-45"></div>
                      <div className="absolute bottom-4 right-4 w-2 h-2 bg-orange-400 transform rotate-45"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">No hay cupones disponibles</h3>
                  <p className="text-gray-400">Vuelve pronto para descubrir nuestros cupones exclusivos</p>
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

      {/* Modal para canjear cupón */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors z-10"
            >
              ×
            </button>
            
            {/* Modal content */}
            <div className="p-6">
              {/* Illustration */}
              <div className="w-48 h-32 mx-auto mb-6 relative">
                {/* Tiger */}
                <div className="absolute left-4 top-4">
                  <div className="w-16 h-12 bg-orange-400 rounded-full relative">
                    {/* Tiger stripes */}
                    <div className="absolute top-1 left-1 w-4 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-2 left-3 w-3 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-3 left-1.5 w-3.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-4 left-4 w-2.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-5 left-1 w-3 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-6 left-3.5 w-2 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-7 left-2 w-2.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-8 left-4.5 w-1.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-9 left-0.5 w-3.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-10 left-3 w-2 h-0.5 bg-black rounded-full"></div>
                  </div>
                  
                  {/* Tiger head */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-orange-400 rounded-full">
                    {/* Eyes */}
                    <div className="absolute top-2 left-1.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="absolute top-2 right-1.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="absolute top-2.5 left-2 w-0.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-2.5 right-2 w-0.5 h-0.5 bg-black rounded-full"></div>
                    
                    {/* Nose */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                    
                    {/* Mouth */}
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-2 h-1 border-b border-black rounded-full"></div>
                  </div>
                </div>
                
                {/* Shopping bags */}
                <div className="absolute left-0 top-8 w-6 h-8 bg-red-500 rounded-t-lg">
                  <div className="absolute top-1 left-1 w-4 h-1 bg-red-600 rounded"></div>
                </div>
                <div className="absolute left-2 top-10 w-6 h-8 bg-purple-500 rounded-t-lg">
                  <div className="absolute top-1 left-1 w-4 h-1 bg-purple-600 rounded"></div>
                </div>
                
                {/* Gift box */}
                <div className="absolute right-8 top-6 w-8 h-6 bg-yellow-400 rounded">
                  <div className="absolute top-1 left-1 w-6 h-4 bg-yellow-300 rounded"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-blue-500"></div>
                  <div className="absolute top-2 left-0 w-8 h-1 bg-blue-500"></div>
                </div>
                
                {/* Coins */}
                <div className="absolute right-4 top-8 w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="absolute right-6 top-10 w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="absolute right-2 top-12 w-3 h-3 bg-yellow-400 rounded-full"></div>
                
                {/* Stars */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-400 transform rotate-45"></div>
                <div className="absolute top-4 right-4 w-1 h-1 bg-blue-400 transform rotate-45"></div>
                <div className="absolute bottom-4 left-6 w-1 h-1 bg-purple-400 transform rotate-45"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-orange-400 transform rotate-45"></div>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-6">Canjear Cupón</h2>
              
              {/* Input field */}
              <div className="mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="X X X X X X"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors text-center text-lg tracking-widest"
                />
              </div>
              
              {/* Description */}
              <p className="text-gray-400 text-center text-sm mb-6">
                Ingrese su código aquí para canjear el cupón y disfrutar de productos con descuento.
              </p>
              
              {/* Redeem button */}
              <button
                onClick={handleRedeemCoupon}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Canjear Cupón
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCouponsView;
