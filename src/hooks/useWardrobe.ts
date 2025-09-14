import { useState, useEffect, useMemo } from 'react';
import { WardrobeItem, WardrobeFilters, WardrobeStats, Collection, OutfitSuggestion, DuplicateWarning } from '@/types/wardrobe';
import { mockWardrobeItems, mockCollections, calculateWardrobeStats, mockOutfitSuggestions } from '@/data/wardrobe';

export function useWardrobe(filters: WardrobeFilters) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(undefined);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        let filtered = [...mockWardrobeItems];
        
        // Apply filters
        if (filters.q) {
          const searchTerm = filters.q.toLowerCase();
          filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.brand?.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.types?.length) {
          filtered = filtered.filter(item => filters.types!.includes(item.type));
        }
        
        if (filters.seasons?.length) {
          filtered = filtered.filter(item => 
            item.seasons.some(season => filters.seasons!.includes(season))
          );
        }
        
        if (filters.occasions?.length) {
          filtered = filtered.filter(item => 
            item.occasions.some(occasion => filters.occasions!.includes(occasion))
          );
        }
        
        if (filters.colors?.length) {
          filtered = filtered.filter(item => 
            item.colors.some(color => filters.colors!.includes(color))
          );
        }
        
        if (filters.collectionId && filters.collectionId !== 'all') {
          filtered = filtered.filter(item => 
            item.collections?.includes(filters.collectionId as string)
          );
        }
        
        // Apply sorting
        switch (filters.sort) {
          case 'newest':
            filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            break;
          case 'mostWorn':
            filtered.sort((a, b) => b.timesWorn - a.timesWorn);
            break;
          case 'leastWorn':
            filtered.sort((a, b) => a.timesWorn - b.timesWorn);
            break;
          case 'alpha':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default:
            break;
        }
        
        setItems(filtered);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadItems();
  }, [filters]);

  return { items, loading, error };
}

export function useWardrobeStats(): WardrobeStats & { loading: boolean } {
  const [stats, setStats] = useState<WardrobeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setStats(calculateWardrobeStats(mockWardrobeItems));
      setLoading(false);
    };
    
    loadStats();
  }, []);

  return { 
    ...(stats || { counts: { total: 0 } as any, byColor: [], mostWorn: [], neverWorn: [] }),
    loading 
  };
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [loading, setLoading] = useState(false);

  const moveToCollection = async (itemIds: string[], collectionId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock update collection counts
    setCollections(prev => prev.map(col => 
      col.id === collectionId 
        ? { ...col, count: col.count + itemIds.length }
        : col
    ));
    setLoading(false);
  };

  return { collections, moveToCollection, loading };
}

// Mutation hooks
export function useWardrobeMutations() {
  const addItem = async (data: Partial<WardrobeItem> & { imageFile?: File }): Promise<WardrobeItem> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newItem: WardrobeItem = {
      id: `item_${Date.now()}`,
      name: data.name || 'New Item',
      brand: data.brand,
      type: data.type || 'top',
      imageUrl: data.imageUrl || '/mock/white-tee.jpg',
      colors: data.colors || [],
      seasons: data.seasons || [],
      occasions: data.occasions || [],
      timesWorn: 0,
      status: 'ok',
      collections: data.collections,
      addedAt: new Date().toISOString(),
      ...data
    };
    
    return newItem;
  };

  const updateItem = async (id: string, patch: Partial<WardrobeItem>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock update
  };

  const deleteItems = async (ids: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Mock delete
  };

  const setStatus = async (ids: string[], status: WardrobeItem['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock status update
  };

  const detectFromImage = async (file: File): Promise<Partial<WardrobeItem> & {
    confidence?: number;
    tags?: string[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI detection based on file name or random
    const mockDetections = [
      {
        name: 'Blue Denim Jacket',
        type: 'outer' as const,
        colors: ['#4682B4', '#1B365D'],
        seasons: ['spring', 'fall'] as ('spring' | 'fall')[],
        occasions: ['casual'] as ('casual')[],
        confidence: 0.92,
        tags: ['denim', 'classic', 'versatile']
      },
      {
        name: 'Black Wool Sweater',
        type: 'top' as const,
        colors: ['#000000'],
        seasons: ['fall', 'winter'] as ('fall' | 'winter')[],
        occasions: ['casual', 'smart'] as ('casual' | 'smart')[],
        confidence: 0.88,
        tags: ['wool', 'warm', 'cozy']
      },
      {
        name: 'White Canvas Sneakers',
        type: 'shoes' as const,
        colors: ['#FFFFFF'],
        seasons: ['spring', 'summer'] as ('spring' | 'summer')[],
        occasions: ['casual', 'sport'] as ('casual' | 'sport')[],
        confidence: 0.95,
        tags: ['canvas', 'comfortable', 'classic']
      }
    ];
    
    return mockDetections[Math.floor(Math.random() * mockDetections.length)];
  };

  const checkDuplicates = async (item: Partial<WardrobeItem>): Promise<DuplicateWarning[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock duplicate detection
    const similar = mockWardrobeItems.filter(existing => 
      existing.type === item.type &&
      existing.name.toLowerCase().includes(item.name?.toLowerCase().split(' ')[0] || '')
    );
    
    return similar.map(existing => ({
      existing,
      similarity: 0.85,
      reasons: ['Similar name', 'Same type', 'Similar color']
    }));
  };

  const suggestOutfitsFor = async (itemId: string): Promise<OutfitSuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return mockOutfitSuggestions;
  };

  return {
    addItem,
    updateItem,
    deleteItems,
    setStatus,
    detectFromImage,
    checkDuplicates,
    suggestOutfitsFor
  };
}