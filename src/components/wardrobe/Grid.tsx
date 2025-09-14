import { Package } from 'lucide-react';
import { WardrobeItem } from '@/types/wardrobe';
import { ItemCard } from './ItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GridProps {
  items: WardrobeItem[];
  loading: boolean;
  error?: Error;
  selectedItems: string[];
  onSelectItem: (id: string, selected: boolean) => void;
  onEditItem: (item: WardrobeItem) => void;
  onDeleteItem: (id: string) => void;
  onViewItem: (item: WardrobeItem) => void;
  onUseInOutfit: (item: WardrobeItem) => void;
  showCheckboxes: boolean;
}

export function Grid({
  items,
  loading,
  error,
  selectedItems,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  onViewItem,
  onUseInOutfit,
  showCheckboxes
}: GridProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Failed to load items</h3>
            <p className="text-muted-foreground mt-1">{error.message}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No items found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your filters or add some items to your wardrobe
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      "grid-cols-1",
      "sm:grid-cols-2", 
      "lg:grid-cols-3",
      "xl:grid-cols-4"
    )}>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          isSelected={selectedItems.includes(item.id)}
          onSelect={onSelectItem}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          onView={onViewItem}
          onUseInOutfit={onUseInOutfit}
          showCheckbox={showCheckboxes}
        />
      ))}

      {/* Loading skeletons */}
      {loading && (
        <>
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Image */}
        <Skeleton className="aspect-[4/3] w-full" />
        
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <div className="flex gap-1">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-4 h-4 rounded-full" />
            </div>
          </div>

          {/* Meta */}
          <div className="flex gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Stats */}
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Button */}
          <Skeleton className="h-8 w-full rounded" />
        </div>
      </CardContent>
    </Card>
  );
}