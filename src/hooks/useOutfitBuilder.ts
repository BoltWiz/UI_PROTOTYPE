import { useState, useEffect, useCallback } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import { OutfitVariant, OutfitConstraints, ItemSwapOption } from '@/types/outfit';
import { mockWardrobeItems } from '@/data/wardrobe';

export function useOutfitBuilder(anchorItem: WardrobeItem) {
  const [variants, setVariants] = useState<OutfitVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [constraints, setConstraints] = useState<OutfitConstraints>({});
  const [error, setError] = useState<string>();

  const generateOutfits = useCallback(async (item: WardrobeItem, customConstraints?: OutfitConstraints) => {
    setLoading(true);
    setError(undefined);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mergedConstraints = { ...constraints, ...customConstraints };
      const availableItems = mockWardrobeItems.filter(i => 
        i.id !== item.id && 
        i.status === 'ok' &&
        (!mergedConstraints.avoidColors || !i.colors.some(color => mergedConstraints.avoidColors?.includes(color))) &&
        (!mergedConstraints.requireStyle || i.occasions.includes(mergedConstraints.requireStyle))
      );

      const generatedVariants: OutfitVariant[] = [
        {
          id: 'variant_a',
          title: 'Classic Everyday',
          description: 'A timeless combination perfect for daily wear',
          items: buildOutfit(item, availableItems, 'classic'),
          score: 92,
          reasons: ['Color harmony', 'Season compatibility', 'Versatile style'],
          colorPalette: ['#FFFFFF', '#1B365D', '#8B4513'],
          tags: ['comfortable', 'versatile', 'classic']
        },
        {
          id: 'variant_b',
          title: 'Weather Ready',
          description: 'Adapted for current weather conditions',
          items: buildOutfit(item, availableItems, 'weather'),
          score: 88,
          reasons: ['Weather appropriate', 'Layering options', 'Practical choice'],
          colorPalette: ['#F5DEB3', '#1B365D', '#000000'],
          tags: ['weather-ready', 'practical', 'layered'],
          weatherSuitability: {
            condition: mergedConstraints.weather || 'sunny',
            score: 95
          }
        },
        {
          id: 'variant_c',
          title: 'Smart Casual',
          description: 'Elevated look for special occasions',
          items: buildOutfit(item, availableItems, 'smart'),
          score: 85,
          reasons: ['Elevated style', 'Professional look', 'Occasion appropriate'],
          colorPalette: ['#1B365D', '#8B4513', '#FFFFFF'],
          tags: ['smart', 'professional', 'polished']
        }
      ];

      setVariants(generatedVariants);
    } catch (err) {
      setError('Failed to generate outfit suggestions');
    } finally {
      setLoading(false);
    }
  }, [constraints]);

  const buildOutfit = (anchor: WardrobeItem, available: WardrobeItem[], style: 'classic' | 'weather' | 'smart'): WardrobeItem[] => {
    const outfit = [anchor];
    const neededTypes = ['top', 'bottom', 'shoes', 'outer', 'accessory'].filter(type => type !== anchor.type);
    
    neededTypes.forEach(type => {
      const candidates = available.filter(item => 
        item.type === type &&
        item.seasons.some(season => anchor.seasons.includes(season)) &&
        item.occasions.some(occasion => anchor.occasions.includes(occasion))
      );
      
      if (candidates.length > 0) {
        // Simple selection logic based on style
        let selected;
        if (style === 'weather' && type === 'outer') {
          selected = candidates.find(item => item.name.toLowerCase().includes('coat')) || candidates[0];
        } else if (style === 'smart') {
          selected = candidates.find(item => item.occasions.includes('smart') || item.occasions.includes('formal')) || candidates[0];
        } else {
          selected = candidates[0];
        }
        
        outfit.push(selected);
      }
    });
    
    return outfit;
  };

  const swapItem = async (outfitId: string, oldItemId: string, newItemId: string) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id === outfitId) {
        const newItems = variant.items.map(item => 
          item.id === oldItemId 
            ? mockWardrobeItems.find(i => i.id === newItemId) || item
            : item
        );
        return { ...variant, items: newItems };
      }
      return variant;
    }));
  };

  const getSwapOptions = async (itemType: string, currentItemId: string): Promise<ItemSwapOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const options = mockWardrobeItems
      .filter(item => 
        item.type === itemType && 
        item.id !== currentItemId && 
        item.status === 'ok'
      )
      .map(item => ({
        item,
        compatibility: Math.floor(Math.random() * 30) + 70, // Mock compatibility score
        reason: 'Color harmony'
      }));
    
    return options.sort((a, b) => b.compatibility - a.compatibility);
  };

  const saveAsFavorite = async (variantId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock save to favorites
    return true;
  };

  const addToToday = async (variantId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock add to daily history
    return true;
  };

  const shareOutfit = async (variantId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock share functionality
    return 'https://app.example.com/outfit/' + variantId;
  };

  const exportPackingList = async (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;
    
    const list = variant.items.map(item => `• ${item.name} (${item.brand || 'No brand'})`).join('\n');
    return `Outfit: ${variant.title}\n\nItems:\n${list}`;
  };

  useEffect(() => {
    generateOutfits(anchorItem);
  }, [anchorItem, generateOutfits]);

  return {
    variants,
    loading,
    error,
    constraints,
    setConstraints,
    generateOutfits,
    swapItem,
    getSwapOptions,
    saveAsFavorite,
    addToToday,
    shareOutfit,
    exportPackingList
  };
}