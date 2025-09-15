export interface MissingItem {
  id: string;
  type: 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';
  name: string;
  description: string;
  imageUrl: string;
  colors: string[];
  seasons: string[];
  occasions: string[];
  priority: 'high' | 'medium' | 'low';
  reason: string;
  estimatedPrice: {
    min: number;
    max: number;
    currency: string;
  };
  shoppingOptions: ShoppingOption[];
  stylistRecommendation?: StylistRecommendation;
}

export interface ShoppingOption {
  id: string;
  retailer: string;
  productName: string;
  price: number;
  currency: string;
  url: string;
  imageUrl: string;
  rating?: number;
  inStock: boolean;
  similarityScore: number;
}

export interface StylistRecommendation {
  stylistId: string;
  stylistName: string;
  message: string;
  alternatives: string[];
  consultationAvailable: boolean;
}

export interface WardrobeGap {
  category: string;
  description: string;
  missingItems: MissingItem[];
  impact: 'high' | 'medium' | 'low';
  completionScore: number;
}

export interface ShoppingSuggestion {
  id: string;
  title: string;
  description: string;
  gaps: WardrobeGap[];
  totalEstimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  createdAt: string;
}