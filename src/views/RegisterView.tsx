import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register form data:', formData);
    // Aquí implementarás la lógica de registro
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 px-12 py-6">
      {/* Top Logo */}
      <div className="mb-8">
        <Link to="/" className="text-white font-bold text-xl">
          GIFCARDS
        </Link>
      </div>

      {/* Main Container with Border */}
      <div className="max-w-5xl mx-auto bg-gray-800/30 backdrop-blur-sm border border-gray-600/50 rounded-3xl overflow-hidden">
        <div className="flex min-h-[280px]">
          {/* Left Section */}
          <div className="flex-1 flex items-start justify-center pt-12 pb-8 px-8 bg-transparent">
            <div className="max-w-sm w-full">
              {/* Title */}
              <div className="mb-6">
                <h1 className="text-white text-2xl font-bold mb-6 leading-tight">
                  PASOS FÁCILES PARA UNIRSE<br />
                  AL PROGRAMA DE<br />
                  MEMBRESÍA GIFCARDS..
                </h1>
                
                {/* Steps */}
                <div className="space-y-3 text-white">
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <p className="text-xs leading-relaxed pt-1">
                      Regístrate usando tu correo electrónico.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <p className="text-xs leading-relaxed pt-1">
                      Por favor, haga clic en el enlace de verificación en su correo electrónico registrado.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <p className="text-xs leading-relaxed pt-1">
                      Completa el formulario de registro.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <p className="text-xs leading-relaxed pt-1">
                      Estás listo, comienza a disfrutar de las compras en GIFCARDS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-900/60">
            <div className="w-full max-w-sm px-4 py-4">
              <h2 className="text-white text-xl font-bold mb-1">REGÍSTRATE</h2>
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                Por favor, proporciona una dirección de correo electrónico<br />
                válida para la verificación de la cuenta..
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Input */}
                <div className="relative mb-4">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/70 border-0 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    placeholder="Email Address"
                    required
                  />
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-full text-sm transition-colors mb-4"
                >
                  ENVIAR CORREO DE VERIFICACIÓN
                </button>

                {/* Divider */}
                <div className="text-center text-gray-400 text-xs py-2 leading-relaxed">
                  Inicia sesión con la cuenta de inicio de sesión existente de una<br />
                  cuenta de red social..
                </div>

                {/* Google Login Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-10 h-10 bg-gray-600/50 hover:bg-gray-600/70 rounded-full transition-colors flex items-center justify-center border border-gray-500/50"
                  >
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-gray-800 font-bold text-xs">G</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-white text-xs text-center space-y-2">
            <div>
              © 2007-2024 GifCards Mall Sdn Bhd
            </div>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Link to="/about" className="hover:text-gray-300">Acerca de GIFCARDS</Link>
              <span>•</span>
              <Link to="/support" className="hover:text-gray-300">Apoyo</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-gray-300">Contáctanos</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-gray-300">Términos de uso</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-gray-300">Política de privacidad</Link>
              <span>•</span>
              <span>🌐 Español</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
