import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { WardrobeFilters } from '@/types/wardrobe';
import { useWardrobe, useCollections, useWardrobeMutations } from '@/hooks/useWardrobe';
import { Toolbar } from '@/components/wardrobe/Toolbar';
import { Grid } from '@/components/wardrobe/Grid';
import { SidebarStats } from '@/components/wardrobe/SidebarStats';
import { AddItemForm } from '@/components/wardrobe/AddItemForm';
import { BuilderDrawer } from '@/components/outfit-builder/BuilderDrawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function Wardrobe() {
  const [filters, setFilters] = useState<WardrobeFilters>({
    collectionId: 'all',
    sort: 'newest'
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutfitBuilder, setShowOutfitBuilder] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);

  const { items, loading, error } = useWardrobe(filters);
  const { collections } = useCollections();
  const { deleteItems, suggestOutfitsFor } = useWardrobeMutations();
  const { toast } = useToast();

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.types?.length) count++;
    if (filters.seasons?.length) count++;
    if (filters.occasions?.length) count++;
    if (filters.colors?.length) count++;
    if (filters.collectionId !== 'all') count++;
    return count;
  }, [filters]);

  const handleSelectItem = (id: string, selected: boolean) => {
    setSelectedItems(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(item => item !== id)
    );
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setIsSelectMode(false);
  };

  const handleEditItem = (item: any) => {
    setActiveItem(item);
    setShowAddModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItems([id]);
      toast({
        title: "Item deleted",
        description: "Item has been removed from your wardrobe"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const handleViewItem = (item: any) => {
    // TODO: Implement item quick view modal
    console.log('View item:', item);
  };

  const handleUseInOutfit = async (item: any) => {
    try {
      setActiveItem(item);
      setShowOutfitBuilder(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open outfit builder",
        variant: "destructive"
      });
    }
  };

  const handleAddItem = () => {
    setActiveItem(null);
    setShowAddModal(true);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-primary-foreground">My</span>{" "}
            <span className="text-accent">Wardrobe</span>
          </h1>
          <p className="text-primary-foreground/80 mt-1">
            Manage your clothing collection with smart organization
          </p>
        </div>
        <Button 
          onClick={handleAddItem}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Toolbar */}
      <Toolbar
        filters={filters}
        onFiltersChange={setFilters}
        collections={collections}
        selectedItems={selectedItems}
        onClearSelection={handleClearSelection}
        onSelectMode={setIsSelectMode}
        isSelectMode={isSelectMode}
      />

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Items Grid */}
        <div className="flex-1 min-w-0">
          <Grid
            items={items}
            loading={loading}
            error={error}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewItem={handleViewItem}
            onUseInOutfit={handleUseInOutfit}
            showCheckboxes={isSelectMode}
          />
        </div>

        {/* Sidebar Stats - Hidden on mobile */}
        <SidebarStats className="hidden lg:block sticky top-6 self-start" />
      </div>

      {/* Add/Edit Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {activeItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
          </DialogHeader>
          
          <AddItemForm
            item={activeItem}
            onSave={() => {
              setShowAddModal(false);
              setActiveItem(null);
              toast({
                title: activeItem ? "Item updated" : "Item added",
                description: activeItem ? "Item successfully updated" : "New item added to wardrobe"
              });
            }}
            onCancel={() => {
              setShowAddModal(false);
              setActiveItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Outfit Builder Drawer */}
      <BuilderDrawer
        open={showOutfitBuilder}
        onOpenChange={setShowOutfitBuilder}
        anchorItem={activeItem}
      />
    </div>
  );
}