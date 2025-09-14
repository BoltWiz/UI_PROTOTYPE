import { Item, SuggestContext, Outfit, Weather } from '@/types';
import { getWeatherConstraints } from './weather';

// Color harmony rules
const colorHarmony: { [key: string]: string[] } = {
  navy: ['white', 'beige', 'cream', 'grey', 'brown'],
  white: ['navy', 'black', 'beige', 'blue', 'grey', 'brown'],
  black: ['white', 'grey', 'beige', 'cream'],
  beige: ['navy', 'white', 'brown', 'cream', 'grey'],
  brown: ['beige', 'cream', 'navy', 'white', 'tan'],
  grey: ['white', 'black', 'navy', 'beige'],
  blue: ['white', 'beige', 'grey', 'navy'],
  'dark-blue': ['white', 'beige', 'grey', 'cream']
};

// Essential item types for complete outfits
const essentialTypes = ['top', 'bottom', 'shoes'];
const optionalTypes = ['outer', 'accessory'];

export const suggestOutfit = (
  items: Item[], 
  context: SuggestContext,
  weather?: Weather
): Outfit | null => {
  
  const { goal, occasion, season, avoidRepeatDays, lastUsedItemIds } = context;
  
  // Filter items by context
  let filteredItems = items.filter(item => {
    // Season filter
    if (season && !item.seasons.includes(season) && !item.seasons.includes('all')) {
      return false;
    }
    
    // Occasion filter - items should match goal or be versatile
    if (!item.occasions.includes(goal) && !item.occasions.includes('casual')) {
      return false;
    }
    
    // Avoid recently used items
    if (avoidRepeatDays && lastUsedItemIds?.includes(item.id)) {
      return false;
    }
    
    return true;
  });

  // Apply weather constraints if available
  if (weather) {
    const weatherConstraints = getWeatherConstraints(weather);
    
    filteredItems = filteredItems.filter(item => {
      // Check fabric constraints
      const itemTags = item.tags || [];
      if (weatherConstraints.avoidFabrics.some(fabric => 
        itemTags.includes(fabric) || item.type.includes(fabric)
      )) {
        return false;
      }
      
      // Check type constraints
      if (weatherConstraints.avoidTypes.some(type => 
        item.type.includes(type) || itemTags.includes(type)
      )) {
        return false;
      }
      
      return true;
    });
  }

  // Group items by type
  const itemsByType = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as { [type: string]: Item[] });

  // Check if we have essential items
  for (const essentialType of essentialTypes) {
    if (!itemsByType[essentialType] || itemsByType[essentialType].length === 0) {
      return null; // Can't create complete outfit
    }
  }

  // Generate outfit combinations
  const combinations = generateCombinations(itemsByType, goal, weather);
  
  if (combinations.length === 0) return null;

  // Score and select best combination
  const scoredCombinations = combinations.map(combo => ({
    items: combo,
    score: scoreOutfit(combo, context, weather)
  })).sort((a, b) => b.score - a.score);

  const bestCombo = scoredCombinations[0];
  
  // Generate explanation
  const explanation = generateExplanation(bestCombo.items, context, weather);

  return {
    id: `outfit_${Date.now()}`,
    userId: 'u1', // Would be dynamic in real app
    itemIds: bestCombo.items.map(item => item.id),
    context: {
      date: new Date().toISOString().split('T')[0],
      goal,
      occasion,
      weather: weather ? {
        condition: weather.today.condition,
        tempC: weather.today.tempC
      } : undefined
    },
    explanation,
    score: bestCombo.score
  };
};

function generateCombinations(
  itemsByType: { [type: string]: Item[] },
  goal: string,
  weather?: Weather
): Item[][] {
  const combinations: Item[][] = [];
  
  // Get essential items (top, bottom, shoes)
  const tops = itemsByType.top || [];
  const bottoms = itemsByType.bottom || [];
  const shoes = itemsByType.shoes || [];
  
  // Generate basic combinations
  for (const top of tops.slice(0, 3)) { // Limit for performance
    for (const bottom of bottoms.slice(0, 3)) {
      for (const shoe of shoes.slice(0, 3)) {
        const combo = [top, bottom, shoe];
        
        // Add outer if weather is cool or goal is smart/formal
        const outers = itemsByType.outer || [];
        if (outers.length > 0 && (
          weather?.today.tempC && weather.today.tempC < 25 ||
          goal === 'smart' || goal === 'formal'
        )) {
          combo.push(outers[0]);
        }
        
        // Add accessory for smart/formal looks
        const accessories = itemsByType.accessory || [];
        if (accessories.length > 0 && (goal === 'smart' || goal === 'formal')) {
          combo.push(accessories[0]);
        }
        
        combinations.push(combo);
      }
    }
  }
  
  return combinations.slice(0, 10); // Limit combinations
}

function scoreOutfit(items: Item[], context: SuggestContext, weather?: Weather): number {
  let score = 0.5; // Base score
  
  // Color harmony score
  const colors = items.flatMap(item => item.colors);
  let colorScore = 0;
  
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const color1 = colors[i];
      const color2 = colors[j];
      
      if (color1 === color2) {
        colorScore += 0.2; // Same color bonus
      } else if (colorHarmony[color1]?.includes(color2)) {
        colorScore += 0.3; // Harmony bonus
      }
    }
  }
  
  score += colorScore / colors.length;
  
  // Goal matching score
  const goalMatchingItems = items.filter(item => 
    item.occasions.includes(context.goal)
  ).length;
  score += (goalMatchingItems / items.length) * 0.3;
  
  // Weather appropriateness
  if (weather) {
    const weatherConstraints = getWeatherConstraints(weather);
    const weatherAppropriate = items.filter(item => {
      const itemTags = item.tags || [];
      
      // Check if item has preferred characteristics
      if (weatherConstraints.preferTypes.some(type => 
        item.type.includes(type) || itemTags.includes(type)
      )) {
        return true;
      }
      
      if (weatherConstraints.preferFabrics.some(fabric => 
        itemTags.includes(fabric)
      )) {
        return true;
      }
      
      return false;
    }).length;
    
    score += (weatherAppropriate / items.length) * 0.2;
  }
  
  return Math.min(1, score); // Cap at 1.0
}

function generateExplanation(items: Item[], context: SuggestContext, weather?: Weather): string {
  const explanations = [];
  
  // Goal-based explanation
  if (context.goal === 'smart') {
    explanations.push('Smart casual combination perfect for professional settings');
  } else if (context.goal === 'casual') {
    explanations.push('Relaxed and comfortable for everyday wear');
  } else if (context.goal === 'formal') {
    explanations.push('Polished formal look for important occasions');
  }
  
  // Weather explanation
  if (weather) {
    const { tempC, condition } = weather.today;
    if (tempC > 30) {
      explanations.push('Light, breathable fabrics perfect for hot weather');
    } else if (tempC < 20) {
      explanations.push('Layered pieces to keep you warm');
    }
    
    if (condition === 'rain') {
      explanations.push('Weather-appropriate choices for rainy conditions');
    } else if (condition === 'sunny') {
      explanations.push('Light colors and fabrics ideal for sunny weather');
    }
  }
  
  // Color explanation
  const colors = [...new Set(items.flatMap(item => item.colors))];
  if (colors.length <= 2) {
    explanations.push('Clean, monochromatic palette');
  } else {
    explanations.push('Harmonious color combination');
  }
  
  return explanations.join('. ') + '.';
}