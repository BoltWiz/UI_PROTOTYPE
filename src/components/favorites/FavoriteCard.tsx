import { useState } from 'react';
import { Heart, Star, RotateCcw, Share2, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { FavoriteOutfit } from '@/types/favorites';
import { ItemChips } from './ItemChips';
import { QualityWeather } from './QualityWeather';
import { UsageStats } from './UsageStats';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface FavoriteCardProps {
  outfit: FavoriteOutfit;
  onToggleFavorite: (id: string) => void;
  onSaveAsTemplate: (id: string) => void;
  onRemixWithAI: (id: string) => void;
  onShare: (id: string) => void;
}

export function FavoriteCard({
  outfit,
  onToggleFavorite,
  onSaveAsTemplate,
  onRemixWithAI,
  onShare
}: FavoriteCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const { toast } = useToast();

  const handleToggleFavorite = async () => {
    setHeartAnimating(true);
    await onToggleFavorite(outfit.id);
    
    if (!outfit.isFavorite) {
      // Show confetti effect for new favorites
      toast({
        title: "Added to favorites! ❤️",
        description: "This outfit is now in your favorites"
      });
    }
    
    setTimeout(() => setHeartAnimating(false), 600);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % outfit.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + outfit.images.length) % outfit.images.length);
  };

  const getStyleColor = (style: string) => {
    const colors = {
      casual: 'bg-blue-100 text-blue-800',
      formal: 'bg-purple-100 text-purple-800',
      sport: 'bg-green-100 text-green-800',
      smart: 'bg-orange-100 text-orange-800',
      street: 'bg-red-100 text-red-800'
    };
    return colors[style as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className={cn(
        "group hover:shadow-xl transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm",
        isHovered && "transform scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", getStyleColor(outfit.style))}>
              {outfit.style}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Added {formatDistanceToNow(new Date(outfit.addedAt))} ago
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={cn(
              "p-1 h-8 w-8 transition-transform duration-200",
              heartAnimating && "animate-pulse scale-125"
            )}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-all duration-200",
                outfit.isFavorite 
                  ? "fill-red-500 text-red-500" 
                  : "text-muted-foreground hover:text-red-500"
              )}
            />
          </Button>
        </div>

        {/* Main Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-background">
          <img
            src={outfit.images[currentImageIndex]}
            alt={`Outfit ${outfit.id} - Image ${currentImageIndex + 1}`}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300",
              isHovered && "scale-105"
            )}
          />
          
          {/* Image Navigation */}
          {outfit.images.length > 1 && (
            <>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {outfit.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentImageIndex 
                        ? "bg-white scale-125" 
                        : "bg-white/50 hover:bg-white/75"
                    )}
                  />
                ))}
              </div>
              
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevImage}
                  className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 border-0"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextImage}
                  className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 border-0"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Item Chips */}
          <ItemChips items={outfit.items} />
          
          {/* Quality & Weather */}
          <QualityWeather quality={outfit.quality} weather={outfit.weather} />
          
          {/* Usage Stats */}
          <UsageStats 
            timesWorn={outfit.timesWorn}
            lastWorn={outfit.lastWorn}
            weeklyWears={outfit.weeklyWears}
          />
          
          {/* Tags */}
          {outfit.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {outfit.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSaveAsTemplate(outfit.id)}
                className="h-8 px-2"
              >
                <Star className="w-4 h-4 mr-1" />
                Template
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemixWithAI(outfit.id)}
                className="h-8 px-2"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Remix
              </Button>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(outfit.id)}
                className="h-8 w-8 p-0"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSaveAsTemplate(outfit.id)}>
                    Save as Template
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRemixWithAI(outfit.id)}>
                    Remix with AI
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare(outfit.id)}>
                    Share Outfit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}