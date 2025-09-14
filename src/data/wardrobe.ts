import { WardrobeItem, WardrobeStats, Collection, OutfitSuggestion, DuplicateWarning, TypeKind } from '@/types/wardrobe';

export const mockWardrobeItems: WardrobeItem[] = [
  {
    id: 'item_1',
    name: 'White Cotton T-Shirt',
    brand: 'Uniqlo',
    type: 'top',
    imageUrl: '/mock/white-tee.jpg',
    colors: ['#FFFFFF'],
    seasons: ['spring', 'summer'],
    occasions: ['casual', 'sport'],
    timesWorn: 25,
    lastWorn: '2024-01-15T10:30:00Z',
    status: 'ok',
    collections: ['casual', 'summer'],
    addedAt: '2023-12-01T00:00:00Z'
  },
  {
    id: 'item_2',
    name: 'Dark Wash Jeans',
    brand: "Levi's",
    type: 'bottom',
    imageUrl: '/mock/dark-jeans.jpg',
    colors: ['#1B365D', '#2C2C54'],
    seasons: ['fall', 'winter', 'spring'],
    occasions: ['casual', 'smart'],
    timesWorn: 18,
    lastWorn: '2024-01-12T14:20:00Z',
    status: 'ok',
    collections: ['casual', 'work'],
    addedAt: '2023-11-15T00:00:00Z'
  },
  {
    id: 'item_3',
    name: 'White Sneakers',
    brand: 'Nike',
    type: 'shoes',
    imageUrl: '/mock/white-sneaker.jpg',
    colors: ['#FFFFFF', '#F5F5F5'],
    seasons: ['spring', 'summer', 'fall'],
    occasions: ['casual', 'sport'],
    timesWorn: 32,
    lastWorn: '2024-01-14T16:45:00Z',
    status: 'ok',
    collections: ['casual', 'gym'],
    addedAt: '2023-10-20T00:00:00Z'
  },
  {
    id: 'item_4',
    name: 'Navy Polo Shirt',
    brand: 'Ralph Lauren',
    type: 'top',
    imageUrl: '/mock/navy-polo.jpg',
    colors: ['#1B365D'],
    seasons: ['spring', 'summer', 'fall'],
    occasions: ['casual', 'smart'],
    timesWorn: 12,
    lastWorn: '2024-01-08T11:15:00Z',
    status: 'ok',
    collections: ['work', 'smart'],
    addedAt: '2023-12-10T00:00:00Z'
  },
  {
    id: 'item_5',
    name: 'Navy Chino Pants',
    brand: 'Zara',
    type: 'bottom',
    imageUrl: '/mock/navy-chino.jpg',
    colors: ['#1B365D'],
    seasons: ['spring', 'summer', 'fall'],
    occasions: ['casual', 'smart', 'formal'],
    timesWorn: 15,
    lastWorn: '2024-01-10T09:30:00Z',
    status: 'ok',
    collections: ['work', 'smart'],
    addedAt: '2023-11-28T00:00:00Z'
  },
  {
    id: 'item_6',
    name: 'Brown Leather Loafers',
    brand: 'Cole Haan',
    type: 'shoes',
    imageUrl: '/mock/brown-loafers.jpg',
    colors: ['#8B4513', '#A0522D'],
    seasons: ['spring', 'fall', 'winter'],
    occasions: ['smart', 'formal'],
    timesWorn: 8,
    lastWorn: '2024-01-05T15:20:00Z',
    status: 'ok',
    collections: ['work', 'formal'],
    addedAt: '2023-12-15T00:00:00Z'
  },
  {
    id: 'item_7',
    name: 'Beige Wool Coat',
    brand: 'COS',
    type: 'outer',
    imageUrl: '/mock/beige-coat.jpg',
    colors: ['#F5DEB3', '#D2B48C'],
    seasons: ['fall', 'winter'],
    occasions: ['casual', 'smart', 'formal'],
    timesWorn: 6,
    lastWorn: '2024-01-03T12:45:00Z',
    status: 'ok',
    collections: ['winter', 'formal'],
    addedAt: '2023-11-05T00:00:00Z'
  },
  {
    id: 'item_8',
    name: 'Black Leather Belt',
    brand: 'Hugo Boss',
    type: 'accessory',
    imageUrl: '/mock/black-belt.jpg',
    colors: ['#000000'],
    seasons: ['spring', 'summer', 'fall', 'winter'],
    occasions: ['casual', 'smart', 'formal'],
    timesWorn: 22,
    lastWorn: '2024-01-11T08:00:00Z',
    status: 'ok',
    collections: ['work', 'formal'],
    addedAt: '2023-10-01T00:00:00Z'
  },
  // Some never worn items
  {
    id: 'item_9',
    name: 'Red Silk Tie',
    brand: 'Hermès',
    type: 'accessory',
    imageUrl: '/mock/white-tee.jpg', // placeholder
    colors: ['#DC143C'],
    seasons: ['spring', 'summer', 'fall', 'winter'],
    occasions: ['formal'],
    timesWorn: 0,
    status: 'ok',
    collections: ['formal'],
    addedAt: '2023-12-20T00:00:00Z'
  },
  {
    id: 'item_10',
    name: 'Green Vintage Sweater',
    brand: 'Thrifted',
    type: 'top',
    imageUrl: '/mock/navy-polo.jpg', // placeholder
    colors: ['#228B22'],
    seasons: ['fall', 'winter'],
    occasions: ['casual'],
    timesWorn: 1,
    lastWorn: '2023-12-25T19:30:00Z',
    status: 'donate',
    collections: ['casual'],
    addedAt: '2023-09-15T00:00:00Z'
  }
];

export const mockCollections: Collection[] = [
  { id: 'all', name: 'All Items', count: 10, color: '#6B7280' },
  { id: 'casual', name: 'Casual', count: 6, color: '#3B82F6' },
  { id: 'work', name: 'Work', count: 5, color: '#8B5CF6' },
  { id: 'formal', name: 'Formal', count: 4, color: '#1F2937' },
  { id: 'summer', name: 'Summer', count: 4, color: '#F59E0B' },
  { id: 'winter', name: 'Winter', count: 3, color: '#06B6D4' },
  { id: 'gym', name: 'Gym', count: 2, color: '#10B981' },
  { id: 'smart', name: 'Smart Casual', count: 4, color: '#EF4444' }
];

export function calculateWardrobeStats(items: WardrobeItem[]): WardrobeStats {
  const initialCounts: Record<TypeKind, number> & { total: number } = {
    top: 0,
    bottom: 0,
    shoes: 0,
    outer: 0,
    accessory: 0,
    total: 0
  };

  const counts = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, initialCounts);

  const colorCounts = items.reduce((acc, item) => {
    item.colors.forEach(color => {
      const existing = acc.find(c => c.color === color);
      if (existing) {
        existing.count++;
      } else {
        acc.push({
          color,
          count: 1,
          name: getColorName(color)
        });
      }
    });
    return acc;
  }, [] as { color: string; count: number; name: string }[]);

  const mostWorn = [...items]
    .sort((a, b) => b.timesWorn - a.timesWorn)
    .slice(0, 5);

  const neverWorn = items
    .filter(item => item.timesWorn === 0)
    .slice(0, 5);

  return {
    counts,
    byColor: colorCounts.sort((a, b) => b.count - a.count),
    mostWorn,
    neverWorn
  };
}

function getColorName(hex: string): string {
  const colorNames: Record<string, string> = {
    '#FFFFFF': 'White',
    '#000000': 'Black',
    '#1B365D': 'Navy',
    '#F5DEB3': 'Beige',
    '#8B4513': 'Brown',
    '#808080': 'Grey',
    '#DC143C': 'Red',
    '#228B22': 'Green',
    '#2C2C54': 'Dark Blue',
    '#F5F5F5': 'Off White',
    '#A0522D': 'Saddle Brown',
    '#D2B48C': 'Tan'
  };
  return colorNames[hex] || hex;
}

export const mockOutfitSuggestions: OutfitSuggestion[] = [
  {
    id: 'outfit_1',
    title: 'Casual Weekend',
    description: 'Perfect for a relaxed day out',
    score: 92,
    items: [mockWardrobeItems[0], mockWardrobeItems[1], mockWardrobeItems[2]] // White tee, jeans, sneakers
  },
  {
    id: 'outfit_2',
    title: 'Smart Casual Office',
    description: 'Professional yet comfortable',
    score: 88,
    items: [mockWardrobeItems[3], mockWardrobeItems[4], mockWardrobeItems[5]] // Navy polo, chinos, loafers
  },
  {
    id: 'outfit_3',
    title: 'Winter Formal',
    description: 'Elegant and warm for formal occasions',
    score: 85,
    items: [mockWardrobeItems[3], mockWardrobeItems[4], mockWardrobeItems[6], mockWardrobeItems[7]] // Polo, chinos, loafers, coat
  }
];