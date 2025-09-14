import { useState, useEffect } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import { ItemSwapOption } from '@/types/outfit';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Search, Star } from 'lucide-react';

interface SwapPopoverProps {
  children: React.ReactNode;
  itemType: string;
  currentItemId: string;
  onSwap: (newItemId: string) => void;
  getSwapOptions: (itemType: string, currentItemId: string) => Promise<ItemSwapOption[]>;
}

export function SwapPopover({ 
  children, 
  itemType, 
  currentItemId, 
  onSwap, 
  getSwapOptions 
}: SwapPopoverProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ItemSwapOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadOptions = async () => {
    setLoading(true);
    try {
      const swapOptions = await getSwapOptions(itemType, currentItemId);
      setOptions(swapOptions);
    } catch (error) {
      console.error('Failed to load swap options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadOptions();
    }
  }, [open]);

  const filteredOptions = options.filter(option => 
    option.item.name.toLowerCase().includes(search.toLowerCase()) ||
    option.item.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSwap = (itemId: string) => {
    onSwap(itemId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 border-b">
          <h4 className="font-semibold mb-2">Swap {itemType}</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-md" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No alternative items found</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredOptions.map(option => (
                <Button
                  key={option.item.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-muted/50"
                  onClick={() => handleSwap(option.item.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={option.item.imageUrl} 
                        alt={option.item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{option.item.name}</p>
                      {option.item.brand && (
                        <p className="text-xs text-muted-foreground">{option.item.brand}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{option.reason}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {option.compatibility}%
                      </Badge>
                      {option.compatibility >= 90 && (
                        <Star className="w-3 h-3 text-warning fill-current" />
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}