import React, { useState, useEffect } from 'react';

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

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState<number>(0);
    const [touchEnd, setTouchEnd] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [items.length]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setCurrentSlide((prev) => (prev + 1) % items.length);
        }
        if (isRightSwipe) {
            setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
    };

    const getPrevIndex = () => (currentSlide - 1 + items.length) % items.length;
    const getNextIndex = () => (currentSlide + 1) % items.length;

    return (
        <div className="relative w-full aspect-square md:h-80 lg:h-96 mb-4 md:mb-8">
            <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-full h-full relative">
                    {/* Slides laterales - solo visibles en desktop */}
                    <div
                        className="hidden lg:block absolute left-0 w-[15%] h-[90%] top-[5%] opacity-30 overflow-hidden rounded-lg"
                        style={{
                            backgroundImage: `url(${items[getPrevIndex()].image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(4px)',
                        }}
                    />
                    <div
                        className="hidden lg:block absolute right-0 w-[15%] h-[90%] top-[5%] opacity-30 overflow-hidden rounded-lg"
                        style={{
                            backgroundImage: `url(${items[getNextIndex()].image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(4px)',
                        }}
                    />

                    {/* Slide principal */}
                    <div className="absolute w-full md:w-[94%] md:left-[3%] lg:w-[70%] lg:left-[15%] h-full md:h-[95%] md:top-[2.5%]">
                        <div className="w-full h-full overflow-hidden rounded-lg md:rounded-xl shadow-lg">
                            <div 
                                className="flex transition-transform duration-1000 ease-in-out h-full"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {items.map((slide, index) => (
                                    <div key={slide.id} className="w-full h-full flex-shrink-0 relative overflow-hidden">
                                        <img 
                                            src={slide.image}
                                            alt={slide.title}
                                            className={`w-full h-full object-cover transform transition-transform duration-[8000ms] ease-linear ${
                                                currentSlide === index ? 'scale-110' : 'scale-100'
                                            }`}
                                        />
                                        {/* Overlay con gradiente */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-80 transition-opacity duration-500" />
                                        
                                        {/* Contenido del slide */}
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold">
                                            {slide.brand}
                                        </div>
                                        
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                                                {slide.title}
                                            </h3>
                                            <p className="text-lg md:text-xl font-semibold text-blue-300 drop-shadow-lg opacity-90">
                                                {slide.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botones de navegación - ocultos en móvil */}
                    <button 
                        onClick={prevSlide}
                        className="hidden md:block absolute left-[1.5%] lg:left-[15%] top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                        aria-label="Slide anterior"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={nextSlide}
                        className="hidden md:block absolute right-[1.5%] lg:right-[15%] top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                        aria-label="Siguiente slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    currentSlide === index ? 'bg-white' : 'bg-white/50'
                                }`}
                                aria-label={`Ir al slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
