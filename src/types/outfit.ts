import { WardrobeItem } from './wardrobe';

export interface OutfitVariant {
  id: string;
  title: string;
  description: string;
  items: WardrobeItem[];
  score: number;
  reasons: string[];
  colorPalette: string[];
  tags: string[];
  weatherSuitability?: {
    condition: 'sunny' | 'rainy' | 'cold' | 'hot';
    score: number;
  };
}

export interface OutfitConstraints {
  avoidColors?: string[];
  requireStyle?: 'casual' | 'smart' | 'formal' | 'sport';
  weather?: 'sunny' | 'rainy' | 'cold' | 'hot';
  budget?: 'low' | 'medium' | 'high';
  brands?: string[];
}

export interface ItemSwapOption {
  item: WardrobeItem;
  compatibility: number;
  reason: string;
}

export interface OutfitBuilderState {
  anchorItem: WardrobeItem;
  variants: OutfitVariant[];
  selectedVariant: string;
  constraints: OutfitConstraints;
  loading: boolean;
  error?: string;
}