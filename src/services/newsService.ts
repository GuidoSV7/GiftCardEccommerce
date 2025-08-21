export interface NewsItem {
    id: number;
    title: string;
    image: string;
    category: string;
}

export const getNewsAndPromotions = async (): Promise<NewsItem[]> => {
    const response = await fetch('http://localhost:3000/newsAndPromotions');
    if (!response.ok) {
        throw new Error('Error al cargar las noticias y promociones');
    }
    return response.json();
};
