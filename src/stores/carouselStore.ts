import { useEffect } from 'react';
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
  selectedProducts: string[];
  selectedOffers: string[];
  maxItems: number;
  showLimitModal: boolean;
  _hasHydrated: boolean;
  
  // Actions
  toggleProduct: (productId: string) => void;
  toggleOffer: (offerId: string) => void;
  setSelectedProducts: (productIds: string[]) => void;
  setSelectedOffers: (offerIds: string[]) => void;
  clearAll: () => void;
  clearAllAndStorage: () => void;
  isProductSelected: (productId: string) => boolean;
  isOfferSelected: (offerId: string) => boolean;
  canSelectMore: () => boolean;
  getTotalSelected: () => number;
  showLimitReachedModal: () => void;
  hideLimitModal: () => void;
  setHasHydrated: (value: boolean) => void;
  forceSync: () => void; // Nueva función para forzar sincronización
}

// Función helper para debug (solo en desarrollo)
const logStateChange = (action: string, data: any) => {
  if (import.meta.env.DEV) {
    console.log(`🔄 ${action}:`, data);
  }
};

export const useCarouselStore = create<CarouselState>()(
  persist(
    (set, get) => {
      console.log('🏪 CarouselStore inicializado');
      
      return {
        selectedProducts: [],
        selectedOffers: [],
        maxItems: 5,
        showLimitModal: false,
        _hasHydrated: false,
      
        toggleProduct: (productId: string) => {
          const { selectedProducts, selectedOffers, maxItems } = get();
          const isSelected = selectedProducts.includes(productId);
          
          logStateChange('toggleProduct', { productId, isSelected, selectedProducts });
          
          if (isSelected) {
            const newSelectedProducts = selectedProducts.filter(id => id !== productId);
            set({ selectedProducts: newSelectedProducts });
            logStateChange('Producto removido', productId);
          } else {
            const totalSelected = selectedProducts.length + selectedOffers.length;
            if (totalSelected < maxItems) {
              const newSelectedProducts = [...selectedProducts, productId];
              set({ selectedProducts: newSelectedProducts });
              logStateChange('Producto agregado', productId);
            } else {
              set({ showLimitModal: true });
            }
          }
        },
        
        toggleOffer: (offerId: string) => {
          const { selectedProducts, selectedOffers, maxItems } = get();
          const isSelected = selectedOffers.includes(offerId);
          
          logStateChange('toggleOffer', { offerId, isSelected, selectedOffers });
          
          if (isSelected) {
            const newSelectedOffers = selectedOffers.filter(id => id !== offerId);
            set({ selectedOffers: newSelectedOffers });
            logStateChange('Oferta removida', offerId);
          } else {
            const totalSelected = selectedProducts.length + selectedOffers.length;
            if (totalSelected < maxItems) {
              const newSelectedOffers = [...selectedOffers, offerId];
              set({ selectedOffers: newSelectedOffers });
              logStateChange('Oferta agregada', offerId);
            } else {
              set({ showLimitModal: true });
            }
          }
        },
        
        setSelectedProducts: (productIds: string[]) => {
          const { selectedOffers, maxItems } = get();
          const totalOther = selectedOffers.length;
          const availableSlots = maxItems - totalOther;
          const newProducts = productIds.slice(0, availableSlots);
          set({ selectedProducts: newProducts });
          logStateChange('setSelectedProducts', newProducts);
        },
        
        setSelectedOffers: (offerIds: string[]) => {
          const { selectedProducts, maxItems } = get();
          const totalOther = selectedProducts.length;
          const availableSlots = maxItems - totalOther;
          const newOffers = offerIds.slice(0, availableSlots);
          set({ selectedOffers: newOffers });
          logStateChange('setSelectedOffers', newOffers);
        },
        
        clearAll: () => {
          set({ selectedProducts: [], selectedOffers: [] });
          logStateChange('clearAll', 'Limpiado todo');
        },
        
        clearAllAndStorage: () => {
          set({ selectedProducts: [], selectedOffers: [] });
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
        },

        setHasHydrated: (value: boolean) => {
          set({ _hasHydrated: value });
        },

        forceSync: () => {
          try {
            const stored = localStorage.getItem('carousel-config');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.state) {
                console.log('🔄 Forzando sincronización desde localStorage:', parsed.state);
                set({
                  selectedProducts: parsed.state.selectedProducts || [],
                  selectedOffers: parsed.state.selectedOffers || [],
                  _hasHydrated: true
                });
              }
            }
          } catch (error) {
            console.error('❌ Error en forceSync:', error);
          }
        }
      };
    },
    {
      name: 'carousel-config',
      partialize: (state) => ({
        selectedProducts: state.selectedProducts || [],
        selectedOffers: state.selectedOffers || [],
        maxItems: state.maxItems,
        showLimitModal: state.showLimitModal,
        _hasHydrated: true
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('✅ Store rehydrated:', {
            selectedProducts: state.selectedProducts?.length || 0,
            selectedOffers: state.selectedOffers?.length || 0
          });
          state._hasHydrated = true;
        }
      }
    }
  )
);

// Hook para debugging y forzar sincronización
export const useCarouselStoreSync = () => {
  const store = useCarouselStore();
  
  // Verificar sincronización en cada uso
  useEffect(() => {
    const stored = localStorage.getItem('carousel-config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const currentProducts = store.selectedProducts;
        const currentOffers = store.selectedOffers;
        const storedProducts = parsed.state?.selectedProducts || [];
        const storedOffers = parsed.state?.selectedOffers || [];
        
        // Si hay discrepancia, sincronizar
        if (JSON.stringify(currentProducts) !== JSON.stringify(storedProducts) ||
            JSON.stringify(currentOffers) !== JSON.stringify(storedOffers)) {
          console.log('⚠️ Discrepancia detectada, sincronizando...');
          store.forceSync();
        }
      } catch (error) {
        console.error('Error verificando sincronización:', error);
      }
    }
  }, [store.selectedProducts, store.selectedOffers]);
  
  return store;
};