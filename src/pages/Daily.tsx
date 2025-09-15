import { useState, useEffect } from 'react';
import { Calendar, Cloud, Clock, RefreshCw, Sparkles, ChevronDown, ChevronUp, Star, Bookmark, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Item, Outfit, Weather, Schedule } from '@/types';
import { getItems, getCurrentUser, getWeatherData, getScheduleData, saveOutfitToHistory } from '@/lib/mock';
import { suggestOutfit } from '@/lib/engine';
import { getWeatherRecommendation } from '@/lib/weather';

export default function Daily() {
  const [dailyOutfit, setDailyOutfit] = useState<Outfit | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [collectionOutfit, setCollectionOutfit] = useState<any>(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadDailyData();
    generateDailyOutfit();
    loadCollectionOutfit();
  }, []);

  const loadCollectionOutfit = () => {
    const saved = localStorage.getItem('collection_outfit');
    if (saved) {
      setCollectionOutfit(JSON.parse(saved));
    }
  };

  const loadDailyData = () => {
    const weatherData = getWeatherData();
    const scheduleData = getScheduleData();
    setWeather(weatherData);
    setSchedule(scheduleData);
  };

  const generateDailyOutfit = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const items = getItems(currentUser.id);
      const weatherData = getWeatherData();
      const scheduleData = getScheduleData();
      
      // Determine goal from schedule
      const primaryEvent = scheduleData.today
        .sort((a, b) => a.dressCode === 'formal' ? -1 : 1)[0]; // Prioritize formal events
      
      const goal = primaryEvent?.dressCode || 'casual';
      
      const context = {
        goal: goal as 'casual' | 'smart' | 'formal' | 'active',
        occasion: primaryEvent?.title.toLowerCase().includes('meeting') ? 'meeting' : undefined,
        avoidRepeatDays: 3
      };

      const outfit = suggestOutfit(items, context, weatherData);
      
      if (outfit) {
        setDailyOutfit(outfit);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateOutfit = () => {
    generateDailyOutfit();
  };

  const handleSaveOutfit = () => {
    if (!dailyOutfit) return;
    
    saveOutfitToHistory(dailyOutfit);
    toast({
      title: "Daily outfit saved",
      description: "Added to your outfit history"
    });
  };

  const handleSaveCollectionOutfit = () => {
    if (!collectionOutfit) return;
    
    // Convert collection outfit to regular outfit format
    const outfit = {
      id: collectionOutfit.id,
      userId: currentUser.id,
      itemIds: collectionOutfit.items.map((item: any) => `collection_${item.type}_${Date.now()}`),
      context: {
        date: new Date().toISOString().split('T')[0],
        goal: 'smart',
        source: 'collection'
      },
      explanation: `Outfit inspired by "${collectionOutfit.collectionTitle}" collection by ${collectionOutfit.stylistName}`,
      score: 0.9,
      isFavorite: false
    };
    
    saveOutfitToHistory(outfit);
    toast({
      title: "Collection outfit saved",
      description: "Added to your outfit history"
    });
  };

  const handleRemoveCollectionOutfit = () => {
    localStorage.removeItem('collection_outfit');
    setCollectionOutfit(null);
    toast({
      title: "Collection outfit removed",
      description: "Removed from daily view"
    });
  };

  const getOutfitItems = (): Item[] => {
    if (!dailyOutfit) return [];
    const items = getItems(currentUser.id);
    return items.filter(item => dailyOutfit.itemIds.includes(item.id));
  };

  const outfitItems = getOutfitItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-fashion-rose bg-clip-text text-transparent">
          What to Wear Today?
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalized outfit recommendation for your day
        </p>
      </div>

      {/* Today's Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weather */}
        {weather && (
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/50 rounded-lg">
                  <Cloud className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Weather in {weather.city}</h3>
                  <p className="text-sm text-muted-foreground">
                    {weather.today.tempC}°C, {weather.today.condition}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-medium">{weather.today.humidity}%</p>
              </div>
            </div>
            <Alert className="mt-3 border-blue-200 bg-white/30">
              <AlertDescription className="text-sm">
                {getWeatherRecommendation(weather)}
              </AlertDescription>
            </Alert>
          </Card>
        )}

        {/* Schedule */}
        {schedule && (
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Today's Schedule</h3>
            </div>
            <div className="space-y-2">
              {schedule.today.map((event, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{event.time}</span>
                    <span>{event.title}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {event.dressCode}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Daily Outfit Recommendation */}
      {dailyOutfit ? (
        <Card className="p-6 bg-gradient-to-br from-card via-card/50 to-fashion-cream/20 border-2 border-primary/20">
          <div className="space-y-4">
            {/* Outfit Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Today's Outfit</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gradient-to-r from-primary to-primary-glow">
                    {dailyOutfit.context.goal}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Confidence: {Math.round(dailyOutfit.score * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRegenerateOutfit} disabled={isGenerating}>
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1" />
                  )}
                  Regenerate
                </Button>
                <Button size="sm" onClick={handleSaveOutfit}>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Save Outfit
                </Button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {outfitItems.map((item, index) => (
                <div key={item.id} className="relative">
                  <div className="aspect-square bg-background rounded-xl overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-colors">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.type}
                    </Badge>
                  </div>
                  {/* Step indicator */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-primary to-primary-glow text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Why this outfit?
                  </span>
                  {isExplanationOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Alert className="mt-2">
                  <Sparkles className="w-4 h-4" />
                  <AlertDescription>
                    {dailyOutfit.explanation}
                    {weather && (
                      <span className="block mt-2 text-sm">
                        <strong>Weather consideration:</strong> {getWeatherRecommendation(weather)}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          {isGenerating ? (
            <div className="space-y-3">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing your day and generating the perfect outfit...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground">Unable to generate daily outfit recommendation</p>
              <Button onClick={handleRegenerateOutfit}>
                Try Again
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Collection Outfit */}
      {collectionOutfit && (
        <Card className="p-6 bg-gradient-to-br from-accent/10 via-accent/5 to-primary/10 border-2 border-accent/30">
          <div className="space-y-4">
            {/* Collection Outfit Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-semibold">From Collection</h3>
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white">
                    Stylist Curated
                  </Badge>
                </div>
                <h4 className="text-lg font-medium text-accent">{collectionOutfit.collectionTitle}</h4>
                <p className="text-sm text-muted-foreground">
                  Curated by <span className="font-medium text-accent">{collectionOutfit.stylistName}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRemoveCollectionOutfit}>
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
                <Button size="sm" onClick={handleSaveCollectionOutfit} className="bg-gradient-to-r from-accent to-primary">
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save to History
                </Button>
              </div>
            </div>

            {/* Collection Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {collectionOutfit.items.map((item: any, index: number) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-background rounded-xl overflow-hidden border-2 border-accent/20 hover:border-accent/50 transition-colors">
                    <img
                      src={item.imageUrl}
                      alt={`${item.type} item`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                      {item.type}
                    </Badge>
                    <div className="flex justify-center gap-1 mt-1">
                      {item.colors.map((color: string, colorIndex: number) => (
                        <div
                          key={colorIndex}
                          className="w-3 h-3 rounded-full border border-accent/30"
                          style={{ 
                            backgroundColor: color === 'white' ? '#ffffff' : 
                                           color === 'navy' ? '#1e3a8a' : 
                                           color === 'dark-blue' ? '#1e40af' : 
                                           color === 'brown' ? '#92400e' : 
                                           color === 'beige' ? '#d6d3d1' : 
                                           color === 'black' ? '#000000' : color 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Step indicator with accent color */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-accent to-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Collection Info */}
            <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Professional Styling</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This outfit combination has been professionally curated by {collectionOutfit.stylistName}. 
                It's designed to work harmoniously together and follows current fashion trends.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Tips */}
      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-2">Daily Style Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <p>• Check weather before finalizing your look</p>
          <p>• Consider your most important event of the day</p>
          <p>• Comfort is key for busy days</p>
          <p>• Layering works well for changing conditions</p>
        </div>
      </Card>
    </div>
  );
}