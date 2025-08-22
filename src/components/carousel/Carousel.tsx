import { useState, useEffect } from 'react';

interface CarouselItem {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    brand: string;
}

interface CarouselProps {
    items: CarouselItem[];
}

export const Carousel = ({ items }: CarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide cada 8 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [items.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
    };

    return (
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
            {/* Slides */}
            <div 
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {items.map((slide, index) => (
                    <div key={slide.id} className="w-full h-full flex-shrink-0 relative overflow-hidden group">
                        <img 
                            src={slide.image}
                            alt={slide.title}
                            className={`w-full h-full object-cover transform transition-transform duration-[8000ms] ease-linear ${
                                currentSlide === index ? 'scale-110' : 'scale-100'
                            }`}
                        />
                        {/* Overlay con gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-70"></div>
                        
                        {/* Contenido del slide */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold transform transition-transform duration-500 translate-y-0 group-hover:translate-y-1">
                            {slide.brand}
                        </div>
                        
                        <div className="absolute bottom-6 left-6 text-white transform transition-all duration-500 translate-y-0 group-hover:translate-y-[-4px]">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                                {slide.title}
                            </h3>
                            <p className="text-lg md:text-xl font-semibold text-blue-300 drop-shadow-lg opacity-90 group-hover:opacity-100">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botones de navegación */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Slide anterior"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Siguiente slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicadores de puntos */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                            currentSlide === index ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Ir al slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
