

import { useState, useEffect } from 'react';
import { 
  MobileMenu, 
  MobileLoginPanel, 
  LoginModal, 
  Overlay,
  MobileHeader,
  DesktopHeader
} from './HomeHeader/index';


export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginPanelOpen, setLoginPanelOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Prevenir el scroll cuando el menú está abierto
  useEffect(() => {
    if (menuOpen || loginPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen, loginPanelOpen]);

  return (
    <header className="bg-[#080b14] py-3 fixed w-full top-0 z-50 shadow-lg">
      {/* Overlay oscuro para el menú móvil y login */}
  <Overlay show={menuOpen || loginPanelOpen} onClick={() => { setMenuOpen(false); setLoginPanelOpen(false); }} />

      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
        {/* Vista Móvil */}
        <MobileHeader
          menuOpen={menuOpen}
          searchOpen={searchOpen}
          loginPanelOpen={loginPanelOpen}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
          onSearchToggle={() => setSearchOpen(!searchOpen)}
          onLoginPanelOpen={() => setLoginPanelOpen(true)}
        />

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <MobileLoginPanel 
          open={loginPanelOpen} 
          onClose={() => setLoginPanelOpen(false)}
          onLoginClick={() => setLoginModalOpen(true)}
        />

        {/* Vista Desktop */}
        <div className="relative">
          <DesktopHeader onLoginModalOpen={() => {
            console.log('HomeHeader: Abriendo modal de login');
            setLoginModalOpen(true);
          }} />
          {/* Login Modal para Desktop */}
          <LoginModal open={loginModalOpen} onClose={() => {
            console.log('HomeHeader: Cerrando modal de login');
            setLoginModalOpen(false);
          }} />
        </div>
      </div>
    </header>
  );
}
