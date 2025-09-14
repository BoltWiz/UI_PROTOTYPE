import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Calendar, 
  Share, 
  Download, 
  Copy,
  Loader2 
} from 'lucide-react';

interface ActionsBarProps {
  selectedVariantId: string;
  onSaveAsFavorite: (variantId: string) => Promise<boolean>;
  onAddToToday: (variantId: string) => Promise<boolean>;
  onShare: (variantId: string) => Promise<string>;
  onExportPackingList: (variantId: string) => Promise<string>;
  disabled?: boolean;
}

export function ActionsBar({
  selectedVariantId,
  onSaveAsFavorite,
  onAddToToday,
  onShare,
  onExportPackingList,
  disabled = false
}: ActionsBarProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAction = async (
    action: string,
    fn: () => Promise<any>,
    successMessage: string
  ) => {
    if (!selectedVariantId || disabled) return;
    
    setLoading(action);
    try {
      const result = await fn();
      toast({
        title: "Success",
        description: successMessage
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSaveAsFavorite = () => {
    handleAction(
      'favorite',
      () => onSaveAsFavorite(selectedVariantId),
      "Outfit saved to favorites"
    );
  };

  const handleAddToToday = () => {
    handleAction(
      'today',
      () => onAddToToday(selectedVariantId),
      "Outfit added to today's plan"
    );
  };

  const handleShare = async () => {
    const url = await handleAction(
      'share',
      () => onShare(selectedVariantId),
      "Outfit link copied to clipboard"
    );
    
    if (url) {
      navigator.clipboard.writeText(url);
    }
  };

  const handleExport = async () => {
    const list = await handleAction(
      'export',
      () => onExportPackingList(selectedVariantId),
      "Packing list copied to clipboard"
    );
    
    if (list) {
      navigator.clipboard.writeText(list);
    }
  };

  const isLoading = (action: string) => loading === action;

  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t">
      <Button
        onClick={handleSaveAsFavorite}
        disabled={disabled || isLoading('favorite')}
        variant="outline"
        className="flex-1 min-w-0 gap-2"
      >
        {isLoading('favorite') ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className="w-4 h-4" />
        )}
        Save Favorite
      </Button>

      <Button
        onClick={handleAddToToday}
        disabled={disabled || isLoading('today')}
        variant="outline"
        className="flex-1 min-w-0 gap-2"
      >
        {isLoading('today') ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Calendar className="w-4 h-4" />
        )}
        Add to Today
      </Button>

      <Button
        onClick={handleShare}
        disabled={disabled || isLoading('share')}
        variant="outline"
        className="flex-1 min-w-0 gap-2"
      >
        {isLoading('share') ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Share className="w-4 h-4" />
        )}
        Share
      </Button>

      <Button
        onClick={handleExport}
        disabled={disabled || isLoading('export')}
        variant="outline"
        className="flex-1 min-w-0 gap-2"
      >
        {isLoading('export') ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export List
      </Button>
    </div>
  );
}