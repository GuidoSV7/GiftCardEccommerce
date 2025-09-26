import { useState } from 'react';

export const HomeFooter = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-[#080b14] text-gray-300 py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* Métodos de pago */}
                <div className="grid grid-cols-3 md:flex md:flex-wrap gap-4 mb-8 md:mb-12">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" className="h-6 md:h-8 object-contain" />
                    <img src="https://brand.mastercard.com/content/dam/mccom/brand-center/brand-mark/assets/MC_Symbol_Opt_Pos_RGB_SVG.svg" alt="Mastercard" className="h-6 md:h-8 object-contain" />
                    <img src="https://www.cryptocompare.com/media/37746251/btc.png" alt="Bitcoin" className="h-6 md:h-8 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-6 md:h-8 object-contain" />
                    <img src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png" alt="Visa" className="h-6 md:h-8 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-6 md:h-8 object-contain" />
                </div>

                {/* Enlaces y redes sociales - Vista Móvil */}
                <div className="md:hidden space-y-4 mb-8">
                    {/* Acerca de GiftCard */}
                    <div className="border-b border-gray-800">
                        <button 
                            className="w-full py-4 flex justify-between items-center text-left"
                            onClick={() => toggleSection('about')}
                        >
                            <span className="text-white font-semibold">Acerca de VEMPERGAMES</span>
                            <span className="text-xl">{openSection === 'about' ? '-' : '+'}</span>
                        </button>
                        {openSection === 'about' && (
                            <ul className="space-y-2 py-4">
                                <li><a href="#" className="block hover:text-white transition-colors">Acerca de Nosotros</a></li>
                                <li><a href="#" className="block hover:text-white transition-colors">Noticias VEMPERGAMES</a></li>
                                <li><a href="#" className="block hover:text-white transition-colors">Apoyo</a></li>
                                <li><a href="#" className="block hover:text-white transition-colors">Contáctanos</a></li>
                            </ul>
                        )}
                    </div>

                    {/* Legal */}
                    <div className="border-b border-gray-800">
                        <button 
                            className="w-full py-4 flex justify-between items-center text-left"
                            onClick={() => toggleSection('legal')}
                        >
                            <span className="text-white font-semibold">Legal</span>
                            <span className="text-xl">{openSection === 'legal' ? '-' : '+'}</span>
                        </button>
                        {openSection === 'legal' && (
                            <ul className="space-y-2 py-4">
                                <li><a href="#" className="block hover:text-white transition-colors">Términos de uso</a></li>
                                <li><a href="#" className="block hover:text-white transition-colors">Términos de venta</a></li>
                                <li><a href="#" className="block hover:text-white transition-colors">Política de privacidad</a></li>
                                <li><a href="#" className="block hover:text-white transition-colors">Política de Contenido Prohibido</a></li>
                            </ul>
                        )}
                    </div>

                    {/* Socios */}
                    <div className="border-b border-gray-800">
                        <button 
                            className="w-full py-4 flex justify-between items-center text-left"
                            onClick={() => toggleSection('partners')}
                        >
                            <span className="text-white font-semibold">Socios</span>
                            <span className="text-xl">{openSection === 'partners' ? '-' : '+'}</span>
                        </button>
                        {openSection === 'partners' && (
                            <ul className="space-y-2 py-4">
                                <li><a href="#" className="block hover:text-white transition-colors">Asociación socio de negocios</a></li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Enlaces y redes sociales - Vista Desktop */}
                <div className="hidden md:grid md:grid-cols-4 gap-8 mb-12">
                    {/* Acerca de GiftCard */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Acerca de VEMPERGAMES</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Acerca de Nosotros</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Noticias VEMPERGAMES</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Apoyo</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contáctanos</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Términos de venta</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Política de Contenido Prohibido</a></li>
                        </ul>
                    </div>

                    {/* Socios */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Socios</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Asociación socio de negocios</a></li>
                        </ul>
                    </div>

                    {/* Mantente actualizado */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Mantente actualizado con nosotros</h3>
                        <div className="flex gap-4 items-center">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148a13.98 13.98 0 0 0 10.15 5.144 4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-800 text-center space-y-4">
                    <div className="text-2xl font-bold text-white">
                        VEMPERGAMES
                    </div>
                    <div className="text-sm text-gray-400">
                        © {new Date().getFullYear()} VEMPERGAMES. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
};
