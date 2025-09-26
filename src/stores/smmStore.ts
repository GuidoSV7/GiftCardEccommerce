import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SmmService, SmmOrder, SmmTicket } from '../services/smmService';

interface SmmState {
  // Services
  selectedServices: string[];
  serviceFilters: {
    category: string;
    search: string;
  };
  
  // Orders
  orderFilters: {
    status: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  
  // Tickets
  ticketFilters: {
    status: string;
    priority: string;
  };
  
  // UI State
  activeTab: 'services' | 'orders' | 'tickets';
  
  // Actions
  setSelectedServices: (services: string[]) => void;
  toggleService: (serviceId: string) => void;
  setServiceFilters: (filters: Partial<SmmState['serviceFilters']>) => void;
  setOrderFilters: (filters: Partial<SmmState['orderFilters']>) => void;
  setTicketFilters: (filters: Partial<SmmState['ticketFilters']>) => void;
  setActiveTab: (tab: SmmState['activeTab']) => void;
  clearAllFilters: () => void;
}

export const useSmmStore = create<SmmState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedServices: [],
      serviceFilters: {
        category: 'all',
        search: '',
      },
      orderFilters: {
        status: 'all',
        dateRange: {
          start: '',
          end: '',
        },
      },
      ticketFilters: {
        status: 'all',
        priority: 'all',
      },
      activeTab: 'services',
      
      // Actions
      setSelectedServices: (services: string[]) => {
        set({ selectedServices: services });
      },
      
      toggleService: (serviceId: string) => {
        const { selectedServices } = get();
        const isSelected = selectedServices.includes(serviceId);
        
        if (isSelected) {
          set({
            selectedServices: selectedServices.filter(id => id !== serviceId)
          });
        } else {
          set({
            selectedServices: [...selectedServices, serviceId]
          });
        }
      },
      
      setServiceFilters: (filters) => {
        set({
          serviceFilters: { ...get().serviceFilters, ...filters }
        });
      },
      
      setOrderFilters: (filters) => {
        set({
          orderFilters: { ...get().orderFilters, ...filters }
        });
      },
      
      setTicketFilters: (filters) => {
        set({
          ticketFilters: { ...get().ticketFilters, ...filters }
        });
      },
      
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },
      
      clearAllFilters: () => {
        set({
          serviceFilters: {
            category: 'all',
            search: '',
          },
          orderFilters: {
            status: 'all',
            dateRange: {
              start: '',
              end: '',
            },
          },
          ticketFilters: {
            status: 'all',
            priority: 'all',
          },
        });
      },
    }),
    {
      name: 'smm-store',
      partialize: (state) => ({
        selectedServices: state.selectedServices,
        serviceFilters: state.serviceFilters,
        orderFilters: state.orderFilters,
        ticketFilters: state.ticketFilters,
        activeTab: state.activeTab,
      }),
    }
  )
);

// Hooks personalizados para facilitar el uso
export const useSmmServices = () => {
  const store = useSmmStore();
  return {
    selectedServices: store.selectedServices,
    serviceFilters: store.serviceFilters,
    setSelectedServices: store.setSelectedServices,
    toggleService: store.toggleService,
    setServiceFilters: store.setServiceFilters,
  };
};

export const useSmmOrders = () => {
  const store = useSmmStore();
  return {
    orderFilters: store.orderFilters,
    setOrderFilters: store.setOrderFilters,
  };
};

export const useSmmTickets = () => {
  const store = useSmmStore();
  return {
    ticketFilters: store.ticketFilters,
    setTicketFilters: store.setTicketFilters,
  };
};
