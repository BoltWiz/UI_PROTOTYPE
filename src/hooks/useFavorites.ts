import { useState, useEffect } from 'react';
import { FavoriteOutfit, FavoritesQuery, FavoritesInsights, Collection, TopItem } from '@/types/favorites';
import { mockFavoriteOutfits, mockInsights, mockCollections, mockTopItems } from '@/data/favorites';

export function useFavorites(query: FavoritesQuery) {
  const [data, setData] = useState<FavoriteOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [cursor, setCursor] = useState<string>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(undefined);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let filtered = [...mockFavoriteOutfits];
        
        // Apply filters
        if (query.q) {
          const searchTerm = query.q.toLowerCase();
          filtered = filtered.filter(outfit => 
            outfit.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            outfit.items.some(item => item.name.toLowerCase().includes(searchTerm))
          );
        }
        
        if (query.style && query.style !== 'all') {
          filtered = filtered.filter(outfit => outfit.style === query.style);
        }
        
        if (query.weather && query.weather !== 'any') {
          filtered = filtered.filter(outfit => outfit.weather.condition === query.weather);
        }
        
        // Apply sorting
        switch (query.sort) {
          case 'newest':
            filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            break;
          case 'mostWorn':
            filtered.sort((a, b) => b.timesWorn - a.timesWorn);
            break;
          case 'highestQuality':
            filtered.sort((a, b) => b.quality - a.quality);
            break;
          case 'weather':
            filtered.sort((a, b) => b.weather.score - a.weather.score);
            break;
          case 'alpha':
            filtered.sort((a, b) => a.items[0]?.name.localeCompare(b.items[0]?.name || '') || 0);
            break;
          default:
            break;
        }
        
        setData(filtered);
        setCursor(filtered.length > 0 ? 'next_page' : undefined);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [query]);

  return { data, loading, error, cursor };
}

export function useInsights(): FavoritesInsights & { loading: boolean } {
  const [data, setData] = useState<FavoritesInsights>(mockInsights);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(mockInsights);
      setLoading(false);
    };
    
    loadInsights();
  }, []);

  return { ...data, loading };
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [loading, setLoading] = useState(false);

  const addToCollection = async (outfitId: string, collectionId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock update count
    setCollections(prev => prev.map(col => 
      col.id === collectionId 
        ? { ...col, count: col.count + 1 }
        : col
    ));
    setLoading(false);
  };

  return { collections, addToCollection, loading };
}

export function useTopItems() {
  const [topItems, setTopItems] = useState<TopItem[]>(mockTopItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopItems = async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      setTopItems(mockTopItems);
      setLoading(false);
    };
    
    loadTopItems();
  }, []);

  return { topItems, loading };
}

// Mutation hooks
export function useFavoriteMutations() {
  const toggleFavorite = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock API call
  };

  const saveAsTemplate = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock save template
  };

  const remixWithAI = async (id: string): Promise<{ images: string[]; note: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      images: ['/mock/outfit1.jpg', '/mock/outfit2.jpg'],
      note: 'AI suggests adding a denim jacket for a more casual look!'
    };
  };

  return { toggleFavorite, saveAsTemplate, remixWithAI };
}