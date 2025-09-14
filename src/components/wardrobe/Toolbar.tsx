import { useState, useCallback, useEffect } from 'react';
import { Search, Command, Filter, X, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { WardrobeFilters, TypeKind, Season, Occasion } from '@/types/wardrobe';
import { Collection } from '@/types/wardrobe';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  filters: WardrobeFilters;
  onFiltersChange: (filters: WardrobeFilters) => void;
  collections: Collection[];
  selectedItems: string[];
  onClearSelection: () => void;
  onSelectMode: (enabled: boolean) => void;
  isSelectMode: boolean;
}

const typeOptions: { value: TypeKind; label: string }[] = [
  { value: 'top', label: 'Tops' },
  { value: 'bottom', label: 'Bottoms' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'outer', label: 'Outerwear' },
  { value: 'accessory', label: 'Accessories' }
];

const seasonOptions: { value: Season; label: string }[] = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' }
];

const occasionOptions: { value: Occasion; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'smart', label: 'Smart' },
  { value: 'formal', label: 'Formal' },
  { value: 'sport', label: 'Sport' },
  { value: 'travel', label: 'Travel' }
];

const colorOptions = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#000000', label: 'Black' },
  { value: '#1B365D', label: 'Navy' },
  { value: '#F5DEB3', label: 'Beige' },
  { value: '#8B4513', label: 'Brown' },
  { value: '#808080', label: 'Grey' },
  { value: '#DC143C', label: 'Red' },
  { value: '#228B22', label: 'Green' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'mostWorn', label: 'Most Worn' },
  { value: 'leastWorn', label: 'Least Worn' },
  { value: 'alpha', label: 'A → Z' }
];

export function Toolbar({ 
  filters, 
  onFiltersChange, 
  collections, 
  selectedItems, 
  onClearSelection, 
  onSelectMode,
  isSelectMode 
}: ToolbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('wardrobe-search')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateFilter = useCallback((key: keyof WardrobeFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  }, [filters, onFiltersChange]);

  const toggleFilterArray = useCallback((key: keyof WardrobeFilters, value: any) => {
    const currentArray = filters[key] as any[] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray.length > 0 ? newArray : undefined);
  }, [filters, updateFilter]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      collectionId: 'all',
      sort: 'newest'
    });
  }, [onFiltersChange]);

  const activeFiltersCount = [
    filters.q,
    filters.types?.length,
    filters.seasons?.length,
    filters.occasions?.length,
    filters.colors?.length,
    filters.collectionId !== 'all' ? filters.collectionId : null
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="wardrobe-search"
            placeholder="Search wardrobe..."
            value={filters.q || ''}
            onChange={(e) => updateFilter('q', e.target.value || undefined)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "pl-10 pr-16 transition-all duration-200",
              searchFocused && "ring-2 ring-primary/20"
            )}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Collections Dropdown */}
        <Select value={filters.collectionId || 'all'} onValueChange={(value) => updateFilter('collectionId', value)}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Collection" />
          </SelectTrigger>
          <SelectContent>
            {collections.map(collection => (
              <SelectItem key={collection.id} value={collection.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: collection.color }}
                  />
                  <span>{collection.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {collection.count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={filters.sort || 'newest'} onValueChange={(value) => updateFilter('sort', value)}>
          <SelectTrigger className="w-full lg:w-48">
            <SortAsc className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Toggle */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "relative",
                activeFiltersCount > 0 && "border-primary"
              )}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <FilterPanel
              filters={filters}
              onToggleFilterArray={toggleFilterArray}
              onClearAll={clearAllFilters}
            />
          </PopoverContent>
        </Popover>

        {/* Select Mode Toggle */}
        <Button
          variant={isSelectMode ? "default" : "outline"}
          onClick={() => onSelectMode(!isSelectMode)}
          className="whitespace-nowrap"
        >
          {isSelectMode ? 'Cancel' : 'Select'}
        </Button>
      </div>

      {/* Selection Bar */}
      {isSelectMode && selectedItems.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-sm font-medium">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Add to Collection
            </Button>
            <Button size="sm" variant="outline">
              Set Status
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearSelection}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.q && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.q}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('q', undefined)} 
              />
            </Badge>
          )}
          
          {filters.types?.map(type => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilterArray('types', type)} 
              />
            </Badge>
          ))}

          {filters.seasons?.map(season => (
            <Badge key={season} variant="secondary" className="gap-1">
              {season}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilterArray('seasons', season)} 
              />
            </Badge>
          ))}

          {filters.occasions?.map(occasion => (
            <Badge key={occasion} variant="secondary" className="gap-1">
              {occasion}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilterArray('occasions', occasion)} 
              />
            </Badge>
          ))}

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

interface FilterPanelProps {
  filters: WardrobeFilters;
  onToggleFilterArray: (key: keyof WardrobeFilters, value: any) => void;
  onClearAll: () => void;
}

function FilterPanel({ filters, onToggleFilterArray, onClearAll }: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Filter Items</h4>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
      </div>

      {/* Types */}
      <div>
        <label className="text-sm font-medium mb-2 block">Type</label>
        <div className="grid grid-cols-2 gap-2">
          {typeOptions.map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.types?.includes(type.value) || false}
                onCheckedChange={() => onToggleFilterArray('types', type.value)}
              />
              <span className="text-sm">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seasons */}
      <div>
        <label className="text-sm font-medium mb-2 block">Season</label>
        <div className="grid grid-cols-2 gap-2">
          {seasonOptions.map(season => (
            <div key={season.value} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.seasons?.includes(season.value) || false}
                onCheckedChange={() => onToggleFilterArray('seasons', season.value)}
              />
              <span className="text-sm">{season.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Occasions */}
      <div>
        <label className="text-sm font-medium mb-2 block">Occasion</label>
        <div className="grid grid-cols-2 gap-2">
          {occasionOptions.map(occasion => (
            <div key={occasion.value} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.occasions?.includes(occasion.value) || false}
                onCheckedChange={() => onToggleFilterArray('occasions', occasion.value)}
              />
              <span className="text-sm">{occasion.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="text-sm font-medium mb-2 block">Colors</label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map(color => (
            <button
              key={color.value}
              onClick={() => onToggleFilterArray('colors', color.value)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                filters.colors?.includes(color.value)
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
  );
}