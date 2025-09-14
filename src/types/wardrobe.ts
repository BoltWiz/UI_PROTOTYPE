export type TypeKind = 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Occasion = 'casual' | 'smart' | 'formal' | 'sport' | 'travel';
export type Status = 'ok' | 'laundry' | 'donate' | 'archived';

export interface WardrobeItem {
  id: string;
  name: string;
  brand?: string;
  type: TypeKind;
  imageUrl: string;
  colors: string[];
  seasons: Season[];
  occasions: Occasion[];
  timesWorn: number;
  lastWorn?: string;
  status: Status;
  collections?: string[];
  addedAt: string;
}

export interface WardrobeFilters {
  q?: string;
  types?: TypeKind[];
  seasons?: Season[];
  occasions?: Occasion[];
  colors?: string[];
  collectionId?: string | 'all';
  sort?: 'newest' | 'mostWorn' | 'leastWorn' | 'alpha';
}

export interface WardrobeStats {
  counts: Record<TypeKind, number> & { total: number };
  byColor: { color: string; count: number; name: string }[];
  mostWorn: WardrobeItem[];
  neverWorn: WardrobeItem[];
}

export interface Collection {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface OutfitSuggestion {
  id: string;
  items: WardrobeItem[];
  title: string;
  score: number;
  description: string;
}

export interface DuplicateWarning {
  existing: WardrobeItem;
  similarity: number;
  reasons: string[];
}