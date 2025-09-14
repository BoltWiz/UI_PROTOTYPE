import { Badge } from '@/components/ui/badge';
import { ItemChip } from '@/types/favorites';
import { cn } from '@/lib/utils';

interface ItemChipsProps {
  items: ItemChip[];
}

const typeColors = {
  top: 'bg-blue-100 text-blue-800 border-blue-200',
  bottom: 'bg-green-100 text-green-800 border-green-200',
  shoes: 'bg-purple-100 text-purple-800 border-purple-200',
  outer: 'bg-orange-100 text-orange-800 border-orange-200',
  accessory: 'bg-pink-100 text-pink-800 border-pink-200'
};

const typeIcons = {
  top: '👕',
  bottom: '👖',
  shoes: '👟',
  outer: '🧥',
  accessory: '👜'
};

export function ItemChips({ items }: ItemChipsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Items in this outfit</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md border"
              />
              <div className="absolute -top-1 -right-1 text-xs">
                {typeIcons[item.type]}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium leading-tight">{item.name}</span>
              <Badge 
                variant="outline" 
                className={cn("text-xs h-5 px-2", typeColors[item.type])}
              >
                {item.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}