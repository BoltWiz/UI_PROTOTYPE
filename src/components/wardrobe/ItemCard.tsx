import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, Plus, Sparkles, ShirtIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WardrobeItem, TypeKind, Season, Occasion } from '@/types/wardrobe';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: WardrobeItem;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onEdit?: (item: WardrobeItem) => void;
  onDelete?: (id: string) => void;
  onView?: (item: WardrobeItem) => void;
  onUseInOutfit?: (item: WardrobeItem) => void;
  showCheckbox?: boolean;
}

// Remove emoji mappings - use text labels instead

const statusColors = {
  ok: 'bg-green-100 text-green-800 border-green-200',
  laundry: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  donate: 'bg-orange-100 text-orange-800 border-orange-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200'
};

const statusLabels = {
  ok: 'Available',
  laundry: 'In Laundry',
  donate: 'To Donate',
  archived: 'Archived'
};

export function ItemCard({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onView,
  onUseInOutfit,
  showCheckbox
}: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    onSelect?.(item.id, checked);
  };

  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-200 bg-card/50 backdrop-blur-sm border-2",
        isHovered && "shadow-xl transform translate-y-[-2px]",
        isSelected && "border-primary ring-2 ring-primary/20",
        !isSelected && "border-border hover:border-primary/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-background">
          <img
            src={item.imageUrl}
            alt={item.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300",
              isHovered && "scale-105"
            )}
          />
          
          {/* Checkbox */}
          {showCheckbox && (
            <div className="absolute top-2 left-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleCheckboxChange}
                className="bg-background/80 border-2"
              />
            </div>
          )}
          
          {/* Status Indicator */}
          {item.status !== 'ok' && (
            <div className="absolute top-2 right-2">
              <Badge className={cn("text-xs", statusColors[item.status])}>
                {statusLabels[item.status]}
              </Badge>
            </div>
          )}
          
          {/* Hover Actions */}
          <div className={cn(
            "absolute top-2 right-2 flex gap-1 transition-opacity duration-200",
            showCheckbox ? "opacity-0" : isHovered ? "opacity-100" : "opacity-0"
          )}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onView?.(item)}
                    className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 border-0"
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 border-0"
                >
                  <MoreHorizontal className="w-4 h-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(item)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUseInOutfit?.(item)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use in Outfit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(item.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">{item.name}</h3>
              {item.brand && (
                <p className="text-xs text-muted-foreground truncate">{item.brand}</p>
              )}
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              {item.type}
            </Badge>
          </div>

          {/* Color Swatches */}
          {item.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Colors:</span>
              <div className="flex gap-1">
                {item.colors.slice(0, 3).map((color, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {item.colors.length > 3 && (
                  <div className="w-4 h-4 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-medium">+{item.colors.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seasons & Occasions */}
          <div className="flex items-center gap-4 text-xs">
            {/* Seasons */}
            {item.seasons.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Seasons:</span>
                <div className="flex gap-1">
                  {item.seasons.slice(0, 2).map(season => (
                    <TooltipProvider key={season}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs capitalize">
                            {season}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="capitalize">{season}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {item.seasons.length > 2 && (
                    <span className="text-muted-foreground">+{item.seasons.length - 2}</span>
                  )}
                </div>
              </div>
            )}

            {/* Occasions */}
            {item.occasions.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">For:</span>
                <div className="flex gap-1">
                  {item.occasions.slice(0, 2).map(occasion => (
                    <TooltipProvider key={occasion}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs capitalize">
                            {occasion}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="capitalize">{occasion}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {item.occasions.length > 2 && (
                    <span className="text-muted-foreground">+{item.occasions.length - 2}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Usage Stats */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {item.timesWorn} wears
              </Badge>
              {item.lastWorn && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-muted-foreground">
                        Last: {formatDistanceToNow(new Date(item.lastWorn), { addSuffix: true })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last worn: {new Date(item.lastWorn).toLocaleDateString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Quick Action */}
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUseInOutfit?.(item)}
              className="w-full text-xs"
            >
              <ShirtIcon className="w-3 h-3 mr-1" />
              Use in Outfit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}