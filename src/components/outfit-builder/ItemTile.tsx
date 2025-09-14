import { useState } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Repeat2 } from 'lucide-react';

interface ItemTileProps {
  item: WardrobeItem;
  isAnchor?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSwapButton?: boolean;
  onSwap?: () => void;
  className?: string;
}

export function ItemTile({ 
  item, 
  isAnchor = false, 
  size = 'md',
  showSwapButton = true,
  onSwap,
  className 
}: ItemTileProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const hasAvailabilityIssue = item.status !== 'ok';

  return (
    <div className={cn(
      "relative group flex flex-col items-center gap-2",
      className
    )}>
      {/* Item Image */}
      <div className={cn(
        "relative rounded-lg overflow-hidden border-2 transition-all",
        sizeClasses[size],
        isAnchor ? "border-primary ring-2 ring-primary/20" : "border-border",
        hasAvailabilityIssue && "opacity-60"
      )}>
        {!imageError ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}

        {/* Anchor badge */}
        {isAnchor && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 text-xs px-1 py-0 bg-primary text-primary-foreground"
          >
            Base
          </Badge>
        )}

        {/* Availability warning */}
        {hasAvailabilityIssue && (
          <div className="absolute -top-1 -right-1 text-warning">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}

        {/* Swap button */}
        {showSwapButton && !isAnchor && (
          <Button
            size="sm"
            variant="secondary"
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity",
              "bg-background/80 backdrop-blur-sm border-0 hover:bg-background/90"
            )}
            onClick={onSwap}
          >
            <Repeat2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Item info */}
      <div className="text-center space-y-1 max-w-20">
        <p className="text-xs font-medium truncate" title={item.name}>
          {item.name}
        </p>
        {item.brand && (
          <p className="text-xs text-muted-foreground truncate" title={item.brand}>
            {item.brand}
          </p>
        )}
        {hasAvailabilityIssue && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            {item.status}
          </Badge>
        )}
      </div>
    </div>
  );
}