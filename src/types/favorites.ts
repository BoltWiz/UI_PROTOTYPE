export type Style = 'casual' | 'formal' | 'sport' | 'smart' | 'street';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type WeatherCondition = 'sunny' | 'rainy' | 'windy' | 'cloudy';

export interface WeatherFit {
  score: number;
  note?: string;
  temp?: number;
  condition?: WeatherCondition;
}

export interface ItemChip {
  id: string;
  type: 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';
  name: string;
  imageUrl: string;
}

export interface FavoriteOutfit {
  id: string;
  style: Style;
  addedAt: string;
  images: string[];
  items: ItemChip[];
  quality: number;
  weather: WeatherFit;
  tags: string[];
  timesWorn: number;
  lastWorn?: string;
  weeklyWears: number[];
  isFavorite: boolean;
  dominantColors?: string[];
}

export interface FavoritesQuery {
  q?: string;
  style?: Style | 'all';
  season?: Season | 'all';
  color?: string;
  sort?: 'newest' | 'mostWorn' | 'highestQuality' | 'weather' | 'alpha';
  dateFrom?: string;
  dateTo?: string;
  weather?: WeatherCondition | 'any';
  cursor?: string;
}

export interface FavoritesInsights {
  total: number;
  avgQuality: number;
  topStyle: Style;
  mostWornSeason: Season;
  styleDistribution: Record<Style, number>;
  seasonDistribution: Record<Season, number>;
}

export interface Collection {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface TopItem {
  id: string;
  name: string;
  imageUrl: string;
  appearances: number;
}