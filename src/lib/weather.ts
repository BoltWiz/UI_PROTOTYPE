import { Weather } from '@/types';
import { getWeatherData } from './mock';

export const getWeather = (city?: string): Weather => {
  // In real app, this would be an API call
  return getWeatherData();
};

export const getWeatherConstraints = (weather: Weather) => {
  const { tempC, condition } = weather.today;
  const constraints = {
    avoidFabrics: [] as string[],
    preferFabrics: [] as string[],
    avoidColors: [] as string[],
    preferColors: [] as string[],
    avoidTypes: [] as string[],
    preferTypes: [] as string[]
  };

  // Temperature-based constraints
  if (tempC > 30) {
    constraints.preferFabrics.push('cotton', 'linen', 'breathable');
    constraints.preferTypes.push('tee', 'tank', 'shorts');
    constraints.avoidTypes.push('coat', 'sweater', 'long-sleeve');
  } else if (tempC < 20) {
    constraints.preferTypes.push('jacket', 'sweater', 'long-sleeve');
    constraints.avoidTypes.push('tank', 'shorts');
  }

  // Weather condition constraints
  switch (condition.toLowerCase()) {
    case 'rain':
    case 'rainy':
      constraints.avoidFabrics.push('suede', 'canvas');
      constraints.preferTypes.push('waterproof', 'jacket');
      constraints.avoidColors.push('white', 'light-colors');
      break;
    case 'sunny':
      constraints.preferColors.push('white', 'light-colors');
      constraints.avoidColors.push('black', 'dark-colors');
      break;
    case 'cloudy':
      // More flexible, no strong constraints
      break;
  }

  return constraints;
};

export const getWeatherRecommendation = (weather: Weather): string => {
  const { tempC, condition } = weather.today;
  
  if (tempC > 30 && condition === 'sunny') {
    return 'Hot and sunny - choose light, breathable fabrics in light colors';
  } else if (condition === 'rain') {
    return 'Rainy weather - avoid delicate fabrics and light colors';
  } else if (tempC < 20) {
    return 'Cool weather - layer up with jackets or sweaters';
  } else {
    return 'Pleasant weather - most clothing choices work well';
  }
};