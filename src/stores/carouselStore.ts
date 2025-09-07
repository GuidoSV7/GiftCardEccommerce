import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CarouselItem {
  id: string;
  type: 'product' | 'offer';
  title: string;
  image: string;
  subtitle?: string;
  brand?: string;
}

interface CarouselState {
  selectedProducts: string[]; // IDs de productos seleccionados
  selectedOffers: string[]; // IDs de ofertas seleccionadas
  maxItems: number;
  showLimitModal: boolean;
  
  // Actions
  toggleProduct: (productId: string) => void;
  toggleOffer: (offerId: string) => void;
  setSelectedProducts: (productIds: string[]) => void;
  setSelectedOffers: (offerIds: string[]) => void;
  clearAll: () => void;
  clearAllAndStorage: () => void; // Nueva función para limpiar también localStorage
  isProductSelected: (productId: string) => boolean;
  isOfferSelected: (offerId: string) => boolean;
  canSelectMore: () => boolean;
  getTotalSelected: () => number;
  showLimitReachedModal: () => void;
  hideLimitModal: () => void;
}

export const useCarouselStore = create<CarouselState>()(
  persist(
    (set, get) => ({
      selectedProducts: [],
      selectedOffers: [],
      maxItems: 5,
      showLimitModal: false,
      
      toggleProduct: (productId: string) => {
        const { selectedProducts, selectedOffers, maxItems } = get();
        const isSelected = selectedProducts.includes(productId);
        
        if (isSelected) {
          // Remover producto
          set({
            selectedProducts: selectedProducts.filter(id => id !== productId)
          });
        } else {
          // Agregar producto si no excede el límite
          const totalSelected = selectedProducts.length + selectedOffers.length;
          if (totalSelected < maxItems) {
            set({
              selectedProducts: [...selectedProducts, productId]
            });
          } else {
            // Mostrar modal de límite alcanzado
            set({ showLimitModal: true });
          }
        }
      },
      
      toggleOffer: (offerId: string) => {
        const { selectedProducts, selectedOffers, maxItems } = get();
        const isSelected = selectedOffers.includes(offerId);
        
        if (isSelected) {
          // Remover oferta
          set({
            selectedOffers: selectedOffers.filter(id => id !== offerId)
          });
        } else {
          // Agregar oferta si no excede el límite
          const totalSelected = selectedProducts.length + selectedOffers.length;
          if (totalSelected < maxItems) {
            set({
              selectedOffers: [...selectedOffers, offerId]
            });
          } else {
            // Mostrar modal de límite alcanzado
            set({ showLimitModal: true });
          }
        }
      },
      
      setSelectedProducts: (productIds: string[]) => {
        const { selectedOffers, maxItems } = get();
        const totalOther = selectedOffers.length;
        const availableSlots = maxItems - totalOther;
        
        set({
          selectedProducts: productIds.slice(0, availableSlots)
        });
      },
      
      setSelectedOffers: (offerIds: string[]) => {
        const { selectedProducts, maxItems } = get();
        const totalOther = selectedProducts.length;
        const availableSlots = maxItems - totalOther;
        
        set({
          selectedOffers: offerIds.slice(0, availableSlots)
        });
      },
      
      clearAll: () => {
        set({
          selectedProducts: [],
          selectedOffers: []
        });
      },
      
      clearAllAndStorage: () => {
        // Limpiar el estado
        set({
          selectedProducts: [],
          selectedOffers: []
        });
        // Limpiar localStorage
        localStorage.removeItem('carousel-config');
      },
      
      isProductSelected: (productId: string) => {
        return get().selectedProducts.includes(productId);
      },
      
      isOfferSelected: (offerId: string) => {
        return get().selectedOffers.includes(offerId);
      },
      
      canSelectMore: () => {
        const { selectedProducts, selectedOffers, maxItems } = get();
        return (selectedProducts.length + selectedOffers.length) < maxItems;
      },
      
      getTotalSelected: () => {
        const { selectedProducts, selectedOffers } = get();
        return selectedProducts.length + selectedOffers.length;
      },
      
      showLimitReachedModal: () => {
        set({ showLimitModal: true });
      },
      
      hideLimitModal: () => {
        set({ showLimitModal: false });
      }
    }),
    {
      name: 'carousel-config', // nombre para localStorage
    }
  )
);
