import React from 'react';
import HomeHeader from '../components/home/HomeHeader';
import MemberSidebar from '../components/member/MemberSidebar';
import { HomeFooter } from '../components/home/HomeFooter';

const MyCouponsView: React.FC = () => {
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
                <h1 className="text-3xl font-bold mb-6 text-white">Mis Cupones</h1>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600">Contenido de Mis Cupones</p>
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

export default MyCouponsView;
