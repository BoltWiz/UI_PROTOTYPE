import { useEffect, useRef, useState } from 'react';
import { FavoriteOutfit } from '@/types/favorites';
import { FavoriteCard } from './FavoriteCard';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import { useFavoriteMutations } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoritesGridProps {
  outfits: FavoriteOutfit[];
  loading: boolean;
  error?: Error;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function FavoritesGrid({ outfits, loading, error, hasMore, onLoadMore }: FavoritesGridProps) {
  const [loadingMore, setLoadingMore] = useState(false);
  const { toggleFavorite, saveAsTemplate, remixWithAI } = useFavoriteMutations();
  const { toast } = useToast();
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          setLoadingMore(true);
          onLoadMore();
          setTimeout(() => setLoadingMore(false), 1000); // Mock delay
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, loadingMore, onLoadMore]);

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    }
  };

  const handleSaveAsTemplate = async (id: string) => {
    try {
      await saveAsTemplate(id);
      toast({
        title: "Template saved! 🎯",
        description: "This outfit is now available as a template"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      });
    }
  };

  const handleRemixWithAI = async (id: string) => {
    try {
      const result = await remixWithAI(id);
      toast({
        title: "AI Remix Ready! ✨",
        description: result.note
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI remix",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (id: string) => {
    try {
      const url = `${window.location.origin}/outfit/${id}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied! 🔗",
        description: "Outfit link has been copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Share unavailable",
        description: "Could not copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load outfits</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!loading && outfits.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className={cn(
        "grid gap-6",
        "grid-cols-1",
        "md:grid-cols-2",
        "xl:grid-cols-3"
      )}>
        {outfits.map((outfit) => (
          <FavoriteCard
            key={outfit.id}
            outfit={outfit}
            onToggleFavorite={handleToggleFavorite}
            onSaveAsTemplate={handleSaveAsTemplate}
            onRemixWithAI={handleRemixWithAI}
            onShare={handleShare}
          />
        ))}
        
        {/* Loading skeletons */}
        {(loading || loadingMore) && (
          <>
            {Array.from({ length: loading ? 6 : 3 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Infinite scroll observer */}
      {hasMore && !loading && (
        <div ref={observerRef} className="h-4" />
      )}

      {/* Load more fallback */}
      {hasMore && !loading && !loadingMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="text-primary hover:underline"
          >
            Load more outfits
          </button>
        </div>
      )}
    </div>
  );
}