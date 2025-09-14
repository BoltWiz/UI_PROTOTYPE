import { useState, useMemo } from 'react';
import { FavoritesQuery } from '@/types/favorites';
import { useFavorites } from '@/hooks/useFavorites';
import { FiltersBar } from '@/components/favorites/FiltersBar';
import { FavoritesGrid } from '@/components/favorites/FavoritesGrid';
import { Sidebar } from '@/components/favorites/Sidebar';
import { Insights } from '@/components/favorites/Insights';

export default function Favorites() {
  const [query, setQuery] = useState<FavoritesQuery>({
    sort: 'newest',
    style: 'all',
    weather: 'any'
  });

  const { data: outfits, loading, error, cursor } = useFavorites(query);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (query.q) count++;
    if (query.style && query.style !== 'all') count++;
    if (query.weather && query.weather !== 'any') count++;
    if (query.color) count++;
    if (query.dateFrom) count++;
    return count;
  }, [query]);

  const handleLoadMore = () => {
    console.log('Loading more...');
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          <span className="text-primary-foreground">My</span>{" "}
          <span className="text-accent">Favorites</span>
        </h1>
        <p className="text-primary-foreground/80">
          Discover patterns in your style and get personalized insights
        </p>
      </div>

      {/* Filters */}
      <FiltersBar
        query={query}
        onQueryChange={setQuery}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          <FavoritesGrid
            outfits={outfits}
            loading={loading}
            error={error}
            hasMore={!!cursor}
            onLoadMore={handleLoadMore}
          />
        </div>

        {/* Sidebar - Hidden on mobile */}
        <Sidebar className="hidden lg:block sticky top-6 self-start" />
      </div>

      {/* Insights Section */}
      <div className="mt-12">
        <Insights />
      </div>
    </div>
  );
}