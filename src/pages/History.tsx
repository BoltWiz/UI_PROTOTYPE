import { useState, useEffect } from 'react';
import { History as HistoryIcon, Filter, Heart, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Outfit, Item } from '@/types';
import { getOutfitHistory, getItems, getCurrentUser, toggleFavorite } from '@/lib/mock';
import { formatDistanceToNow } from 'date-fns';

export default function History() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGoal, setFilterGoal] = useState<string>('all');
  const [filterOccasion, setFilterOccasion] = useState<string>('all');
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadHistory();
    loadItems();
  }, []);

  const loadHistory = () => {
    const history = getOutfitHistory(currentUser.id);
    setOutfits(history.sort((a, b) => new Date(b.context.date).getTime() - new Date(a.context.date).getTime()));
  };

  const loadItems = () => {
    const userItems = getItems(currentUser.id);
    setItems(userItems);
  };

  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = searchTerm === '' || 
      outfit.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outfit.context.goal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGoal = filterGoal === 'all' || outfit.context.goal === filterGoal;
    const matchesOccasion = filterOccasion === 'all' || outfit.context.occasion === filterOccasion;
    
    return matchesSearch && matchesGoal && matchesOccasion;
  });

  const handleToggleFavorite = (outfitId: string) => {
    toggleFavorite(outfitId, currentUser.id);
    loadHistory(); // Reload to show updated favorite status
    toast({
      title: "Favorite updated",
      description: "Outfit favorite status changed"
    });
  };

  const getOutfitItems = (outfit: Outfit): Item[] => {
    return items.filter(item => outfit.itemIds.includes(item.id));
  };

  const getRecentlyUsedWarning = (outfit: Outfit): string | null => {
    const outfitDate = new Date(outfit.context.date);
    const daysSince = Math.floor((Date.now() - outfitDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince < 3) {
      return `Worn ${daysSince === 0 ? 'today' : `${daysSince} day${daysSince === 1 ? '' : 's'} ago`}`;
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-primary-foreground">Outfit</span>{" "}
            <span className="text-accent">History</span>
          </h1>
          <p className="text-primary-foreground/80 mt-1">
            View and manage your past outfits
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HistoryIcon className="w-4 h-4" />
          <span>{outfits.length} outfits</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search outfits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={filterGoal} onValueChange={setFilterGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="smart">Smart Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterOccasion} onValueChange={setFilterOccasion}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by occasion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Occasions</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Outfit Grid */}
      {filteredOutfits.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOutfits.map((outfit) => {
            const outfitItems = getOutfitItems(outfit);
            const recentWarning = getRecentlyUsedWarning(outfit);
            
            return (
              <Card key={outfit.id} className="p-4 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={outfit.isFavorite ? "default" : "secondary"}>
                          {outfit.context.goal}
                        </Badge>
                        {outfit.context.occasion && (
                          <Badge variant="outline" className="text-xs">
                            {outfit.context.occasion}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(outfit.context.date).toLocaleDateString()}</span>
                        <span>({formatDistanceToNow(new Date(outfit.context.date), { addSuffix: true })})</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(outfit.id)}
                      className={outfit.isFavorite ? "text-red-500" : "text-muted-foreground"}
                    >
                      <Heart className={`w-4 h-4 ${outfit.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {/* Items Preview */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {outfitItems.map((item) => (
                      <div key={item.id} className="aspect-square bg-background rounded-lg overflow-hidden border">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Score and Details */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Score: {Math.round(outfit.score * 100)}%
                    </div>
                    {outfit.context.weather && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{outfit.context.weather.tempC}°C</span>
                        <span>•</span>
                        <span>{outfit.context.weather.condition}</span>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  <p className="text-sm text-muted-foreground">
                    {outfit.explanation}
                  </p>

                  {/* Recent Warning */}
                  {recentWarning && (
                    <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-sm">
                        <strong>Recently worn:</strong> {recentWarning}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <HistoryIcon className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">No outfits found</p>
              <p className="text-muted-foreground">
                {outfits.length === 0 
                  ? "Start creating outfits to build your history"
                  : "Try adjusting your filters"
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Card */}
      {outfits.length > 0 && (
        <Card className="p-4 bg-muted/30">
          <h4 className="font-semibold mb-2">Your Style Stats</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium">{outfits.length}</p>
              <p className="text-muted-foreground">Total Outfits</p>
            </div>
            <div className="text-center">
              <p className="font-medium">{outfits.filter(o => o.isFavorite).length}</p>
              <p className="text-muted-foreground">Favorites</p>
            </div>
            <div className="text-center">
              <p className="font-medium">
                {Math.round(outfits.reduce((sum, o) => sum + o.score, 0) / outfits.length * 100)}%
              </p>
              <p className="text-muted-foreground">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="font-medium">
                {(() => {
                  const goalCounts = outfits.reduce((acc, outfit) => {
                    const goal = outfit.context.goal;
                    acc[goal] = (acc[goal] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const entries = Object.entries(goalCounts);
                  const sorted = entries.sort(([,a], [,b]) => b - a);
                  return sorted[0]?.[0] || 'None';
                })()}
              </p>
              <p className="text-muted-foreground">Favorite Style</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}