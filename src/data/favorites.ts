import { FavoriteOutfit, FavoritesInsights, Collection, TopItem } from '@/types/favorites';

export const mockFavoriteOutfits: FavoriteOutfit[] = [
  {
    id: 'outfit_1',
    style: 'casual',
    addedAt: '2024-01-15T10:30:00Z',
    images: ['/mock/outfit1.jpg', '/mock/outfit2.jpg'],
    items: [
      { id: 'item_1', type: 'top', name: 'White Tee', imageUrl: '/mock/white-tee.jpg' },
      { id: 'item_2', type: 'bottom', name: 'Dark Jeans', imageUrl: '/mock/dark-jeans.jpg' },
      { id: 'item_3', type: 'shoes', name: 'White Sneakers', imageUrl: '/mock/white-sneaker.jpg' }
    ],
    quality: 85,
    weather: { score: 92, note: 'Perfect for sunny days', temp: 24, condition: 'sunny' },
    tags: ['everyday', 'comfortable', 'versatile'],
    timesWorn: 12,
    lastWorn: '2024-01-10T09:00:00Z',
    weeklyWears: [2, 1, 3, 2, 1, 2, 1, 0],
    isFavorite: true,
    dominantColors: ['#FFFFFF', '#2E2E2E', '#F5F5F5']
  },
  {
    id: 'outfit_2',
    style: 'smart',
    addedAt: '2024-01-12T14:20:00Z',
    images: ['/mock/outfit2.jpg'],
    items: [
      { id: 'item_4', type: 'top', name: 'Navy Polo', imageUrl: '/mock/navy-polo.jpg' },
      { id: 'item_5', type: 'bottom', name: 'Navy Chinos', imageUrl: '/mock/navy-chino.jpg' },
      { id: 'item_6', type: 'shoes', name: 'Brown Loafers', imageUrl: '/mock/brown-loafers.jpg' }
    ],
    quality: 78,
    weather: { score: 88, note: 'Great for office', temp: 22, condition: 'cloudy' },
    tags: ['work', 'professional', 'clean'],
    timesWorn: 8,
    lastWorn: '2024-01-08T08:30:00Z',
    weeklyWears: [1, 2, 1, 1, 2, 1, 0, 0],
    isFavorite: true,
    dominantColors: ['#1B365D', '#8B4513', '#2C2C54']
  },
  {
    id: 'outfit_3',
    style: 'formal',
    addedAt: '2024-01-10T16:45:00Z',
    images: ['/mock/outfit1.jpg'],
    items: [
      { id: 'item_7', type: 'outer', name: 'Beige Coat', imageUrl: '/mock/beige-coat.jpg' },
      { id: 'item_8', type: 'bottom', name: 'Dark Jeans', imageUrl: '/mock/dark-jeans.jpg' },
      { id: 'item_9', type: 'accessory', name: 'Black Belt', imageUrl: '/mock/black-belt.jpg' }
    ],
    quality: 92,
    weather: { score: 75, note: 'Layer for cold', temp: 15, condition: 'windy' },
    tags: ['elegant', 'winter', 'layered'],
    timesWorn: 5,
    lastWorn: '2024-01-05T18:00:00Z',
    weeklyWears: [0, 1, 0, 1, 1, 0, 1, 1],
    isFavorite: true,
    dominantColors: ['#F5DEB3', '#2F4F4F', '#000000']
  },
  {
    id: 'outfit_4',
    style: 'sport',
    addedAt: '2024-01-08T11:15:00Z',
    images: ['/mock/outfit2.jpg'],
    items: [
      { id: 'item_10', type: 'top', name: 'White Tee', imageUrl: '/mock/white-tee.jpg' },
      { id: 'item_11', type: 'bottom', name: 'Navy Chinos', imageUrl: '/mock/navy-chino.jpg' },
      { id: 'item_12', type: 'shoes', name: 'White Sneakers', imageUrl: '/mock/white-sneaker.jpg' }
    ],
    quality: 80,
    weather: { score: 95, note: 'Perfect for workout', temp: 26, condition: 'sunny' },
    tags: ['active', 'breathable', 'comfortable'],
    timesWorn: 15,
    lastWorn: '2024-01-07T07:00:00Z',
    weeklyWears: [3, 2, 2, 3, 2, 2, 1, 0],
    isFavorite: true,
    dominantColors: ['#FFFFFF', '#1B365D', '#F0F0F0']
  },
  {
    id: 'outfit_5',
    style: 'street',
    addedAt: '2024-01-05T19:30:00Z',
    images: ['/mock/outfit1.jpg'],
    items: [
      { id: 'item_13', type: 'top', name: 'White Tee', imageUrl: '/mock/white-tee.jpg' },
      { id: 'item_14', type: 'bottom', name: 'Dark Jeans', imageUrl: '/mock/dark-jeans.jpg' },
      { id: 'item_15', type: 'outer', name: 'Beige Coat', imageUrl: '/mock/beige-coat.jpg' }
    ],
    quality: 88,
    weather: { score: 82, note: 'Trendy and warm', temp: 18, condition: 'cloudy' },
    tags: ['trendy', 'urban', 'edgy'],
    timesWorn: 7,
    lastWorn: '2024-01-03T15:30:00Z',
    weeklyWears: [1, 1, 2, 1, 1, 1, 0, 0],
    isFavorite: true,
    dominantColors: ['#FFFFFF', '#2E2E2E', '#F5DEB3']
  },
  {
    id: 'outfit_6',
    style: 'casual',
    addedAt: '2024-01-03T12:00:00Z',
    images: ['/mock/outfit2.jpg'],
    items: [
      { id: 'item_16', type: 'top', name: 'Navy Polo', imageUrl: '/mock/navy-polo.jpg' },
      { id: 'item_17', type: 'bottom', name: 'Navy Chinos', imageUrl: '/mock/navy-chino.jpg' },
      { id: 'item_18', type: 'shoes', name: 'Brown Loafers', imageUrl: '/mock/brown-loafers.jpg' }
    ],
    quality: 76,
    weather: { score: 90, note: 'Light and breezy', temp: 25, condition: 'sunny' },
    tags: ['relaxed', 'summer', 'light'],
    timesWorn: 9,
    lastWorn: '2024-01-02T14:20:00Z',
    weeklyWears: [1, 2, 1, 2, 1, 1, 1, 0],
    isFavorite: true,
    dominantColors: ['#1B365D', '#8B4513', '#4682B4']
  }
];

export const mockInsights: FavoritesInsights = {
  total: 6,
  avgQuality: 83.2,
  topStyle: 'casual',
  mostWornSeason: 'summer',
  styleDistribution: {
    casual: 2,
    smart: 1,
    formal: 1,
    sport: 1,
    street: 1
  },
  seasonDistribution: {
    spring: 1,
    summer: 3,
    fall: 1,
    winter: 1
  }
};

export const mockCollections: Collection[] = [
  { id: 'col_1', name: 'Summer', count: 12, color: '#FFD700' },
  { id: 'col_2', name: 'Work', count: 8, color: '#4169E1' },
  { id: 'col_3', name: 'Date Night', count: 5, color: '#DC143C' },
  { id: 'col_4', name: 'Travel', count: 15, color: '#32CD32' },
  { id: 'col_5', name: 'Weekend', count: 20, color: '#FF6347' }
];

export const mockTopItems: TopItem[] = [
  { id: 'item_1', name: 'White Tee', imageUrl: '/mock/white-tee.jpg', appearances: 18 },
  { id: 'item_2', name: 'Dark Jeans', imageUrl: '/mock/dark-jeans.jpg', appearances: 15 },
  { id: 'item_3', name: 'White Sneakers', imageUrl: '/mock/white-sneaker.jpg', appearances: 12 },
  { id: 'item_4', name: 'Navy Polo', imageUrl: '/mock/navy-polo.jpg', appearances: 10 },
  { id: 'item_5', name: 'Brown Loafers', imageUrl: '/mock/brown-loafers.jpg', appearances: 8 }
];