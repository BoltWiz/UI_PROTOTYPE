import { useState } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import { useOutfitBuilder } from '@/hooks/useOutfitBuilder';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LoadingState } from './LoadingState';
import { VariantCard } from './VariantCard';
import { RefineConstraints } from './RefineConstraints';
import { ActionsBar } from './ActionsBar';
import { ItemTile } from './ItemTile';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X, Sparkles } from 'lucide-react';

interface BuilderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorItem: WardrobeItem | null;
}

export function BuilderDrawer({ open, onOpenChange, anchorItem }: BuilderDrawerProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('variant_a');
  
  const {
    variants,
    loading,
    error,
    constraints,
    setConstraints,
    generateOutfits,
    swapItem,
    getSwapOptions,
    saveAsFavorite,
    addToToday,
    shareOutfit,
    exportPackingList
  } = useOutfitBuilder(anchorItem!);

  if (!anchorItem) return null;

  const selectedVariant = variants.find(v => v.id === selectedVariantId);

  const handleRegenerate = () => {
    if (anchorItem) {
      generateOutfits(anchorItem, constraints);
    }
  };

  const handleSwapItem = (variantId: string, oldItemId: string, newItemId: string) => {
    swapItem(variantId, oldItemId, newItemId);
    // Auto-select the variant being modified
    setSelectedVariantId(variantId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <SheetTitle className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Outfit Builder
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                Create perfect outfits with {anchorItem.name}
              </p>
            </div>
          </div>

          {/* Anchor Item Display */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <ItemTile 
              item={anchorItem} 
              isAnchor={true} 
              size="lg" 
              showSwapButton={false}
            />
            <div className="space-y-1">
              <h3 className="font-semibold">{anchorItem.name}</h3>
              {anchorItem.brand && (
                <p className="text-sm text-muted-foreground">{anchorItem.brand}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {anchorItem.occasions.map(occasion => (
                  <Badge key={occasion} variant="outline" className="text-xs">
                    {occasion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <RefineConstraints
              constraints={constraints}
              onUpdate={setConstraints}
              onRegenerate={handleRegenerate}
            />
            
            <Button
              onClick={handleRegenerate}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Failed to generate outfits</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRegenerate} variant="outline">
                Try Again
              </Button>
            </div>
          ) : variants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No outfits generated yet</h3>
              <p className="text-muted-foreground">Click "Regenerate" to create outfit suggestions</p>
            </div>
          ) : (
            <>
              {/* Variant Selection Tabs */}
              <div className="flex gap-2 border-b">
                {variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      selectedVariantId === variant.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + index)} - {variant.title}
                  </button>
                ))}
              </div>

              {/* Selected Variant */}
              {selectedVariant && (
                <VariantCard
                  variant={selectedVariant}
                  isSelected={true}
                  anchorItemId={anchorItem.id}
                  onSelect={() => {}}
                  onSwapItem={(oldItemId, newItemId) => 
                    handleSwapItem(selectedVariant.id, oldItemId, newItemId)
                  }
                  getSwapOptions={getSwapOptions}
                />
              )}

              {/* Actions */}
              <ActionsBar
                selectedVariantId={selectedVariantId}
                onSaveAsFavorite={saveAsFavorite}
                onAddToToday={addToToday}
                onShare={shareOutfit}
                onExportPackingList={exportPackingList}
                disabled={loading}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}