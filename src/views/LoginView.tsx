import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, type LoginCredentials } from '../services/userService';

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginUser(formData);
      if (user) {
        console.log('Login successful:', user);
        // Redirigir al dashboard o home después del login exitoso
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    // Aquí implementarías la lógica de Google OAuth
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
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
              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-white text-2xl font-bold mb-4 leading-tight">
                  BIENVENIDO DE VUELTA A<br />
                  GIFCARDS
                </h1>
                <p className="text-gray-300 text-xs leading-relaxed">
                  ¡Hola! Inicia sesión en tu cuenta y continúa disfrutando<br />
                  de tu experiencia de compra en GIFCARDS.
                </p>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegisterRedirect}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
              >
                CREAR NUEVA CUENTA
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-900/60">
            <div className="w-full max-w-sm px-4 py-4">
              <h2 className="text-white text-xl font-bold mb-1">INICIAR SESIÓN</h2>
              
              {/* Error Message */}
              {error && (
                <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Input */}
                <div className="relative mb-3">
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
                    placeholder="Correo electrónico"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative mb-3">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/70 border-0 rounded-lg pl-11 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    placeholder="Contraseña"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-right mb-2">
                  <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300 text-xs">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Divider */}
                <div className="text-center text-gray-400 text-xs py-2 leading-relaxed">
                  Inicia sesión con la cuenta de inicio de sesión existente de una<br />
                  cuenta de red social.
                </div>

                {/* Google Login */}
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

              {/* Register Link */}
              <div className="text-center mt-3">
                <p className="text-gray-400 text-xs">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Crear cuenta nueva
                  </Link>
                </p>
              </div>
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

export default LoginView;
