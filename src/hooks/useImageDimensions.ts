import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  isHorizontal: boolean;
  isVertical: boolean;
  isSquare: boolean;
}

export const useImageDimensions = (imageUrl: string): ImageDimensions => {
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 1,
    isHorizontal: false,
    isVertical: false,
    isSquare: false
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const isHorizontal = aspectRatio > 1.2; // Más ancho que alto
      const isVertical = aspectRatio < 0.8;   // Más alto que ancho
      const isSquare = aspectRatio >= 0.8 && aspectRatio <= 1.2; // Casi cuadrado

      setDimensions({
        width: img.width,
        height: img.height,
        aspectRatio,
        isHorizontal,
        isVertical,
        isSquare
      });
    };

    img.onerror = () => {
      // Si hay error, usar valores por defecto
      setDimensions({
        width: 0,
        height: 0,
        aspectRatio: 1,
        isHorizontal: false,
        isVertical: true,
        isSquare: false
      });
    };

    img.src = imageUrl;
  }, [imageUrl]);

  return dimensions;
};
