import { MissingItem, ShoppingOption, WardrobeGap, ShoppingSuggestion, StylistRecommendation } from '@/types/suggestions';
import { Item } from '@/types';

// Mock shopping data
const mockShoppingOptions: ShoppingOption[] = [
  {
    id: 'shop1',
    retailer: 'Zara',
    productName: 'Classic White Button Shirt',
    price: 890000,
    currency: 'VND',
    url: 'https://zara.com/product/123',
    imageUrl: '/mock/white-tee.jpg',
    rating: 4.5,
    inStock: true,
    similarityScore: 95
  },
  {
    id: 'shop2',
    retailer: 'Uniqlo',
    productName: 'Cotton Oxford Shirt',
    price: 690000,
    currency: 'VND',
    url: 'https://uniqlo.com/product/456',
    imageUrl: '/mock/white-tee.jpg',
    rating: 4.3,
    inStock: true,
    similarityScore: 88
  },
  {
    id: 'shop3',
    retailer: 'H&M',
    productName: 'Regular Fit Shirt',
    price: 450000,
    currency: 'VND',
    url: 'https://hm.com/product/789',
    imageUrl: '/mock/white-tee.jpg',
    rating: 4.0,
    inStock: false,
    similarityScore: 82
  }
];

const mockStylistRecommendations: StylistRecommendation[] = [
  {
    stylistId: 's1',
    stylistName: 'Emma Style',
    message: 'Một chiếc áo sơ mi trắng cổ điển sẽ hoàn thiện tủ đồ của bạn. Tôi khuyên nên chọn chất liệu cotton cao cấp.',
    alternatives: ['Áo polo trắng', 'Áo blouse trắng', 'Áo sơ mi kẻ sọc nhẹ'],
    consultationAvailable: true
  },
  {
    stylistId: 's2',
    stylistName: 'Sarah Chen',
    message: 'Với phong cách hiện tại của bạn, một đôi giày oxford nâu sẽ rất phù hợp cho các dịp formal.',
    alternatives: ['Giày loafer nâu', 'Giày derby đen', 'Giày monk strap'],
    consultationAvailable: true
  }
];

export const analyzeWardrobeGaps = (userItems: Item[]): WardrobeGap[] => {
  const itemsByType = userItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const gaps: WardrobeGap[] = [];

  // Check for missing formal wear
  const formalTops = userItems.filter(item => 
    item.type === 'top' && item.occasions.includes('formal')
  );
  
  if (formalTops.length === 0) {
    gaps.push({
      category: 'Formal Wear',
      description: 'Thiếu áo sơ mi hoặc áo vest cho các dịp trang trọng',
      impact: 'high',
      completionScore: 25,
      missingItems: [
        {
          id: 'missing1',
          type: 'top',
          name: 'Áo Sơ Mi Trắng Cổ Điển',
          description: 'Áo sơ mi trắng là item cơ bản không thể thiếu trong tủ đồ. Phù hợp cho công việc, họp mặt và các dịp trang trọng.',
          imageUrl: '/mock/white-tee.jpg',
          colors: ['white'],
          seasons: ['spring', 'summer', 'fall', 'winter'],
          occasions: ['formal', 'smart'],
          priority: 'high',
          reason: 'Cần thiết cho outfit công việc và các dịp trang trọng',
          estimatedPrice: { min: 450000, max: 1200000, currency: 'VND' },
          shoppingOptions: mockShoppingOptions,
          stylistRecommendation: mockStylistRecommendations[0]
        }
      ]
    });
  }

  // Check for missing versatile shoes
  const versatileShoes = userItems.filter(item => 
    item.type === 'shoes' && 
    (item.occasions.includes('smart') || item.occasions.includes('formal'))
  );

  if (versatileShoes.length === 0) {
    gaps.push({
      category: 'Versatile Footwear',
      description: 'Thiếu giày đa năng cho các dịp smart casual và formal',
      impact: 'medium',
      completionScore: 40,
      missingItems: [
        {
          id: 'missing2',
          type: 'shoes',
          name: 'Giày Oxford Nâu',
          description: 'Giày oxford nâu là lựa chọn hoàn hảo cho outfit smart casual và formal. Dễ phối đồ và tạo điểm nhấn thanh lịch.',
          imageUrl: '/mock/brown-loafers.jpg',
          colors: ['brown'],
          seasons: ['spring', 'fall', 'winter'],
          occasions: ['smart', 'formal'],
          priority: 'medium',
          reason: 'Tăng tính linh hoạt cho outfit công việc và dạo phố',
          estimatedPrice: { min: 1200000, max: 3500000, currency: 'VND' },
          shoppingOptions: [
            {
              id: 'shoe1',
              retailer: 'Clarks',
              productName: 'Desert Boot Brown Leather',
              price: 2890000,
              currency: 'VND',
              url: 'https://clarks.com/product/123',
              imageUrl: '/mock/brown-loafers.jpg',
              rating: 4.7,
              inStock: true,
              similarityScore: 92
            },
            {
              id: 'shoe2',
              retailer: 'Cole Haan',
              productName: 'Grand Oxford Brown',
              price: 3200000,
              currency: 'VND',
              url: 'https://colehaan.com/product/456',
              imageUrl: '/mock/brown-loafers.jpg',
              rating: 4.6,
              inStock: true,
              similarityScore: 89
            }
          ],
          stylistRecommendation: mockStylistRecommendations[1]
        }
      ]
    });
  }

  // Check for missing outerwear
  const outerwear = userItems.filter(item => item.type === 'outer');
  
  if (outerwear.length === 0) {
    gaps.push({
      category: 'Outerwear',
      description: 'Thiếu áo khoác cho thời tiết mát mẻ và tạo layer',
      impact: 'medium',
      completionScore: 60,
      missingItems: [
        {
          id: 'missing3',
          type: 'outer',
          name: 'Áo Blazer Navy',
          description: 'Áo blazer navy là item đa năng, có thể mặc đi làm hoặc dạo phố. Tạo vẻ chuyên nghiệp và thanh lịch.',
          imageUrl: '/mock/beige-coat.jpg',
          colors: ['navy'],
          seasons: ['spring', 'fall', 'winter'],
          occasions: ['smart', 'formal', 'casual'],
          priority: 'medium',
          reason: 'Tăng tính chuyên nghiệp và linh hoạt trong phối đồ',
          estimatedPrice: { min: 800000, max: 2500000, currency: 'VND' },
          shoppingOptions: [
            {
              id: 'blazer1',
              retailer: 'Zara',
              productName: 'Structured Blazer Navy',
              price: 1590000,
              currency: 'VND',
              url: 'https://zara.com/blazer/123',
              imageUrl: '/mock/beige-coat.jpg',
              rating: 4.4,
              inStock: true,
              similarityScore: 90
            }
          ]
        }
      ]
    });
  }

  return gaps;
};

export const generateShoppingSuggestions = (userItems: Item[]): ShoppingSuggestion => {
  const gaps = analyzeWardrobeGaps(userItems);
  
  const totalMin = gaps.reduce((sum, gap) => 
    sum + gap.missingItems.reduce((itemSum, item) => itemSum + item.estimatedPrice.min, 0), 0
  );
  
  const totalMax = gaps.reduce((sum, gap) => 
    sum + gap.missingItems.reduce((itemSum, item) => itemSum + item.estimatedPrice.max, 0), 0
  );

  return {
    id: `suggestion_${Date.now()}`,
    title: 'Hoàn thiện tủ đồ của bạn',
    description: 'AI đã phân tích tủ đồ và đưa ra gợi ý những item còn thiếu để tạo ra nhiều outfit đa dạng hơn.',
    gaps,
    totalEstimatedCost: {
      min: totalMin,
      max: totalMax,
      currency: 'VND'
    },
    createdAt: new Date().toISOString()
  };
};

export const getItemRecommendations = async (itemType: string, userStyle: string[]): Promise<MissingItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const recommendations: MissingItem[] = [
    {
      id: 'rec1',
      type: 'top' as const,
      name: 'Áo Sơ Mi Trắng Premium',
      description: 'Áo sơ mi trắng chất liệu cotton cao cấp, form slim fit hiện đại. Phù hợp cho mọi dịp từ công việc đến dạo phố.',
      imageUrl: '/mock/white-tee.jpg',
      colors: ['white'],
      seasons: ['spring', 'summer', 'fall', 'winter'],
      occasions: ['formal', 'smart', 'casual'],
      priority: 'high',
      reason: 'Item cơ bản thiết yếu, tăng 40% khả năng tạo outfit đa dạng',
      estimatedPrice: { min: 590000, max: 1490000, currency: 'VND' },
      shoppingOptions: mockShoppingOptions,
      stylistRecommendation: mockStylistRecommendations[0]
    }
  ];

  return recommendations;
};

export const formatPrice = (price: number, currency: string = 'VND'): string => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  }
  return `${price.toLocaleString()} ${currency}`;
};

export const calculateWardrobeCompleteness = (userItems: Item[]): number => {
  const essentialTypes = ['top', 'bottom', 'shoes'];
  const essentialOccasions = ['casual', 'smart', 'formal'];
  
  let score = 0;
  let maxScore = essentialTypes.length * essentialOccasions.length;
  
  for (const type of essentialTypes) {
    for (const occasion of essentialOccasions) {
      const hasItem = userItems.some(item => 
        item.type === type && item.occasions.includes(occasion)
      );
      if (hasItem) score++;
    }
  }
  
  return Math.round((score / maxScore) * 100);
};