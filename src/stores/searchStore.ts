import { create } from 'zustand';
import { getProducts, getCategories, type Product, type Category } from '../services/productService';

export interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'category';
  image?: string;
  category?: string;
}

interface SearchState {
  query: string;
  products: Product[];
  categories: Category[];
  searchResults: SearchResult[];
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setQuery: (query: string) => void;
  initializeData: () => Promise<void>;
  search: (query: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  products: [],
  categories: [],
  searchResults: [],
  isLoading: false,
  isInitialized: false,

  setQuery: (query: string) => {
    set({ query });
    get().search(query);
  },

  initializeData: async () => {
    const { isInitialized } = get();
    if (isInitialized) return;

    try {
      set({ isLoading: true });
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      set({ 
        products: productsData, 
        categories: categoriesData,
        isInitialized: true,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading search data:', error);
      set({ isLoading: false });
    }
  },

  search: (query: string) => {
    const { products, categories } = get();
    
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Buscar productos por nombre y descripción
    const matchingProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );

    matchingProducts.forEach(product => {
      results.push({
        id: product.id,
        title: product.title,
        type: 'product',
        image: product.imageUrl,
        category: product.category.name
      });
    });

    // Buscar categorías por nombre
    const matchingCategories = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm)
    );

    matchingCategories.forEach(category => {
      results.push({
        id: category.id,
        title: category.name,
        type: 'category'
      });
    });

    // Limitar a 8 resultados y ordenar (productos primero)
    const sortedResults = results
      .sort((a, b) => {
        if (a.type === 'product' && b.type === 'category') return -1;
        if (a.type === 'category' && b.type === 'product') return 1;
        return 0;
      })
      .slice(0, 8);

    set({ searchResults: sortedResults });
  },

  clearSearch: () => {
    set({ query: '', searchResults: [] });
  }
}));
