import { useState } from 'react';
import { Search, Filter, X, Calendar, Cloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { FavoritesQuery, Style, WeatherCondition } from '@/types/favorites';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

interface FiltersBarProps {
  query: FavoritesQuery;
  onQueryChange: (query: FavoritesQuery) => void;
  activeFiltersCount: number;
}

const styles: Array<{ value: Style | 'all'; label: string }> = [
  { value: 'all', label: 'All Styles' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'sport', label: 'Sport' },
  { value: 'smart', label: 'Smart' },
  { value: 'street', label: 'Street' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'mostWorn', label: 'Most Worn' },
  { value: 'highestQuality', label: 'Highest Quality' },
  { value: 'weather', label: 'Weather Fit' },
  { value: 'alpha', label: 'A → Z' }
];

const weatherOptions: Array<{ value: WeatherCondition | 'any'; label: string; icon: string }> = [
  { value: 'any', label: 'Any Weather', icon: '🌤️' },
  { value: 'sunny', label: 'Sunny', icon: '☀️' },
  { value: 'cloudy', label: 'Cloudy', icon: '☁️' },
  { value: 'rainy', label: 'Rainy', icon: '🌧️' },
  { value: 'windy', label: 'Windy', icon: '🌪️' }
];

const availableColors = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#000000', label: 'Black' },
  { value: '#1B365D', label: 'Navy' },
  { value: '#F5DEB3', label: 'Beige' },
  { value: '#8B4513', label: 'Brown' },
  { value: '#808080', label: 'Grey' }
];

export function FiltersBar({ query, onQueryChange, activeFiltersCount }: FiltersBarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    onQueryChange({ ...query, q: value });
  };

  const clearAllFilters = () => {
    onQueryChange({
      ...query,
      style: 'all',
      sort: 'newest',
      weather: 'any'
    });
    setDateRange(undefined);
  };

  const removeFilter = (key: keyof FavoritesQuery) => {
    const newQuery = { ...query };
    if (key === 'style') newQuery.style = 'all';
    else if (key === 'weather') newQuery.weather = 'any';
    else delete newQuery[key];
    onQueryChange(newQuery);
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search outfits, tags, items..."
            value={query.q || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Style Filter */}
        <Select value={query.style || 'all'} onValueChange={(value) => onQueryChange({ ...query, style: value as Style | 'all' })}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            {styles.map(style => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={query.sort || 'newest'} onValueChange={(value) => onQueryChange({ ...query, sort: value as any })}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* More Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "relative",
            activeFiltersCount > 0 && "border-primary"
          )}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
          {/* Weather Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Weather</label>
            <Select value={query.weather || 'any'} onValueChange={(value) => onQueryChange({ ...query, weather: value as WeatherCondition | 'any' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weatherOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                    ) : (
                      format(dateRange.from, 'MMM dd, yyyy')
                    )
                  ) : (
                    'Pick dates'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Color Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Dominant Color</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => onQueryChange({ 
                    ...query, 
                    color: query.color === color.value ? undefined : color.value 
                  })}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    query.color === color.value 
                      ? "border-primary scale-110" 
                      : "border-border hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {query.q && (
            <Badge variant="secondary" className="gap-1">
              Search: "{query.q}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('q')} />
            </Badge>
          )}
          
          {query.style && query.style !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Style: {query.style}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('style')} />
            </Badge>
          )}
          
          {query.weather && query.weather !== 'any' && (
            <Badge variant="secondary" className="gap-1">
              Weather: {query.weather}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('weather')} />
            </Badge>
          )}
          
          {dateRange && (
            <Badge variant="secondary" className="gap-1">
              Date range
              <X className="w-3 h-3 cursor-pointer" onClick={() => setDateRange(undefined)} />
            </Badge>
          )}
          
          {query.color && (
            <Badge variant="secondary" className="gap-1">
              Color
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('color')} />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}