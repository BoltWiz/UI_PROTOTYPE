import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WeatherFit } from '@/types/favorites';
import { cn } from '@/lib/utils';

interface QualityWeatherProps {
  quality: number;
  weather: WeatherFit;
}

const weatherIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  windy: '🌪️'
};

const getQualityColor = (quality: number) => {
  if (quality >= 80) return 'text-green-600';
  if (quality >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getQualityLabel = (quality: number) => {
  if (quality >= 90) return 'Excellent';
  if (quality >= 80) return 'Great';
  if (quality >= 70) return 'Good';
  if (quality >= 60) return 'Fair';
  return 'Needs Improvement';
};

const getWeatherColor = (score: number) => {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export function QualityWeather({ quality, weather }: QualityWeatherProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Quality Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Quality</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className={cn("text-sm font-semibold", getQualityColor(quality))}>
                  {quality}%
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getQualityLabel(quality)} - Based on item condition, fit, and styling</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Progress 
          value={quality} 
          className="h-2"
        />
      </div>

      {/* Weather Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Weather Fit</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1">
                  {weather.condition && (
                    <span className="text-sm">
                      {weatherIcons[weather.condition]}
                    </span>
                  )}
                  <span className={cn("text-sm font-semibold", getWeatherColor(weather.score))}>
                    {weather.score}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p>{weather.note}</p>
                  {weather.temp && (
                    <p className="text-xs">Recommended temp: {weather.temp}°C</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Progress 
          value={weather.score} 
          className="h-2"
        />
        {weather.temp && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Best at {weather.temp}°C</span>
            {weather.condition && (
              <span>• {weather.condition}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}