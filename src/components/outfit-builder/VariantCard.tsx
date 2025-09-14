import { OutfitVariant } from '@/types/outfit';
import { ItemTile } from './ItemTile';
import { SwapPopover } from './SwapPopover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Star, CloudRain, Sun, Snowflake, Wind } from 'lucide-react';

interface VariantCardProps {
  variant: OutfitVariant;
  isSelected?: boolean;
  anchorItemId: string;
  onSelect: () => void;
  onSwapItem: (oldItemId: string, newItemId: string) => void;
  getSwapOptions: (itemType: string, currentItemId: string) => Promise<any[]>;
}

export function VariantCard({ 
  variant, 
  isSelected = false, 
  anchorItemId,
  onSelect,
  onSwapItem,
  getSwapOptions
}: VariantCardProps) {
  
  const getWeatherIcon = (condition?: string) => {
    switch (condition) {
      case 'rainy': return <CloudRain className="w-4 h-4" />;
      case 'cold': return <Snowflake className="w-4 h-4" />;
      case 'hot': return <Sun className="w-4 h-4" />;
      default: return <Wind className="w-4 h-4" />;
    }
  };

  return (
    <Card className={cn(
      "cursor-pointer transition-all hover:shadow-md",
      isSelected && "ring-2 ring-primary border-primary"
    )} onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{variant.title}</h3>
            <p className="text-sm text-muted-foreground">{variant.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {variant.weatherSuitability && (
              <Badge variant="outline" className="gap-1">
                {getWeatherIcon(variant.weatherSuitability.condition)}
                {variant.weatherSuitability.score}%
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <Star className="w-3 h-3 fill-current" />
              {variant.score}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items Grid */}
        <div className="grid grid-cols-5 gap-3 justify-items-center">
          {variant.items.map(item => (
            <SwapPopover
              key={item.id}
              itemType={item.type}
              currentItemId={item.id}
              onSwap={(newItemId) => onSwapItem(item.id, newItemId)}
              getSwapOptions={getSwapOptions}
            >
              <div>
                <ItemTile
                  item={item}
                  isAnchor={item.id === anchorItemId}
                  size="md"
                  showSwapButton={item.id !== anchorItemId}
                />
              </div>
            </SwapPopover>
          ))}
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Colors:</span>
          <div className="flex gap-1">
            {variant.colorPalette.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {variant.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Reasons */}
        <div className="space-y-1">
          <span className="text-xs font-medium">Why this outfit?</span>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {variant.reasons.map((reason, index) => (
              <li key={index}>• {reason}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}