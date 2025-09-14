import { useState } from 'react';
import { Plus, TrendingUp, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCollections, useTopItems } from '@/hooks/useFavorites';
import { Collection, TopItem } from '@/types/favorites';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { collections, addToCollection } = useCollections();
  const { topItems, loading: topItemsLoading } = useTopItems();
  const [draggedOutfit, setDraggedOutfit] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    if (draggedOutfit) {
      await addToCollection(draggedOutfit, collectionId);
      setDraggedOutfit(null);
    }
  };

  return (
    <aside className={cn("w-80 space-y-6", className)}>
      {/* Collections */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Collections</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Drag outfits here to organize
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, collection.id)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Top Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Items
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Most featured in favorites
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {topItemsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            topItems.map((item, index) => (
              <TopItemCard key={item.id} item={item} rank={index + 1} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Style Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Color Variety:</strong> Try adding more colorful pieces this week to expand your style range!
            </p>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Weather Ready:</strong> Your outfits have great weather scores. Keep up the smart seasonal choices!
            </p>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

interface CollectionCardProps {
  collection: Collection;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

function CollectionCard({ collection, onDragOver, onDrop }: CollectionCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={cn(
        "p-3 rounded-lg border-2 border-dashed transition-all cursor-pointer hover:bg-muted/50",
        isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      )}
      onDragOver={(e) => {
        onDragOver(e);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        onDrop(e);
        setIsDragOver(false);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: collection.color }}
          />
          <span className="font-medium">{collection.name}</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {collection.count}
        </Badge>
      </div>
    </div>
  );
}

interface TopItemCardProps {
  item: TopItem;
  rank: number;
}

function TopItemCard({ item, rank }: TopItemCardProps) {
  const maxAppearances = 20; // For progress calculation
  const percentage = (item.appearances / maxAppearances) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-lg border"
        />
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
          {rank}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={percentage} className="h-1 flex-1" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {item.appearances} times
          </span>
        </div>
      </div>
    </div>
  );
}