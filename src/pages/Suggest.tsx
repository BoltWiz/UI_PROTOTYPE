import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Heart, Save, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StyleChatbot } from '@/components/StyleChatbot';
import { useToast } from '@/hooks/use-toast';
import { Item, Outfit, SuggestContext } from '@/types';
import { getItems, getCurrentUser, getWeatherData, saveOutfitToHistory, getUserPreferences } from '@/lib/mock';
import { suggestOutfit } from '@/lib/engine';
import { ShoppingSuggestions } from '@/components/suggestions/ShoppingSuggestions';
import { WardrobeAnalysis } from '@/components/suggestions/WardrobeAnalysis';
import { generateShoppingSuggestions } from '@/lib/suggestions';
import { WardrobeGap } from '@/types/suggestions';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Suggest() {
  const [items, setItems] = useState<Item[]>([]);
  const [suggestedOutfit, setSuggestedOutfit] = useState<Outfit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [context, setContext] = useState<SuggestContext>({
    goal: 'casual',
    avoidRepeatDays: 3
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your outfit assistant. Ask me about outfit combinations, style tips, or anything fashion-related!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wardrobeGaps, setWardrobeGaps] = useState<WardrobeGap[]>([]);
  const [selectedGap, setSelectedGap] = useState<WardrobeGap | null>(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadItems();
    loadPreferences();
    analyzeWardrobe();
  }, []);

  const loadItems = () => {
    const userItems = getItems(currentUser.id);
    setItems(userItems);
  };

  const loadPreferences = () => {
    const prefs = getUserPreferences(currentUser.id);
    setContext(prev => ({
      ...prev,
      avoidRepeatDays: prefs.avoidRepeatDays || 3
    }));
  };

  const analyzeWardrobe = () => {
    const userItems = getItems(currentUser.id);
    const suggestions = generateShoppingSuggestions(userItems);
    setWardrobeGaps(suggestions.gaps);
  };

  const handleGenerateOutfit = async () => {
    if (items.length === 0) {
      toast({
        title: "No items found",
        description: "Add items to your wardrobe first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Add some delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const weather = getWeatherData();
      
      // Get recent outfit history for avoid repeat logic
      const recentHistory = JSON.parse(localStorage.getItem('outfit_history') || '[]')
        .filter((outfit: Outfit) => outfit.userId === currentUser.id)
        .slice(0, context.avoidRepeatDays)
        .flatMap((outfit: Outfit) => outfit.itemIds);

      const suggestionContext: SuggestContext = {
        ...context,
        lastUsedItemIds: recentHistory
      };

      const outfit = suggestOutfit(items, suggestionContext, weather);
      
      if (outfit) {
        setSuggestedOutfit(outfit);
      } else {
        toast({
          title: "No suitable outfit found",
          description: "Try adjusting your filters or adding more items",
          variant: "destructive"
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveOutfit = () => {
    if (!suggestedOutfit) return;
    
    saveOutfitToHistory(suggestedOutfit);
    toast({
      title: "Outfit saved",
      description: "Added to your outfit history"
    });
  };

  const handleFavoriteOutfit = () => {
    if (!suggestedOutfit) return;
    
    const favoriteOutfit = { ...suggestedOutfit, isFavorite: true };
    saveOutfitToHistory(favoriteOutfit);
    toast({
      title: "Outfit favorited",
      description: "Added to your favorites"
    });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "That's a great question! For a casual look, I'd recommend pairing light colors with darker bottoms.",
        "Based on your wardrobe, you could try mixing textures for more visual interest.",
        "For this weather, layering would work well. Consider adding a light jacket or cardigan.",
        "Color coordination is key! Try the 60-30-10 rule: 60% neutral, 30% secondary, 10% accent color.",
        "Accessories can transform any outfit. A simple belt or watch can elevate your look.",
        "For smart casual, try pairing dress pants with a polo shirt or casual blazer."
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleConsultStylist = (stylistId: string) => {
    toast({
      title: "Tư vấn stylist",
      description: "Đang kết nối với stylist chuyên nghiệp...",
    });
  };

  const handleViewGap = (gap: WardrobeGap) => {
    setSelectedGap(gap);
    setShowSuggestions(true);
  };

  const outfitItems = suggestedOutfit 
    ? items.filter(item => suggestedOutfit.itemIds.includes(item.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-fashion-rose bg-clip-text text-transparent">
          Outfit Suggestions
        </h1>
        <p className="text-muted-foreground mt-1">
          Get AI-powered outfit recommendations, wardrobe analysis, and shopping suggestions
        </p>
      </div>

      {/* Tabs for different features */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setShowSuggestions(false)}
          className={`px-6 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
            !showSuggestions
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Outfit Generator
        </button>
        <button
          onClick={() => setShowSuggestions(true)}
          className={`px-6 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
            showSuggestions
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Wardrobe Analysis
        </button>
      </div>

      {!showSuggestions ? (
        <>
      {/* Filters */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4" />
            <Label className="text-sm font-medium">Preferences</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={context.goal} onValueChange={(value: SuggestContext['goal']) => 
                setContext(prev => ({ ...prev, goal: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="smart">Smart Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="active">Active/Sport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Occasion</Label>
              <Select value={context.occasion || 'any'} onValueChange={(value) => 
                setContext(prev => ({ ...prev, occasion: value === 'any' ? undefined : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any occasion</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Season Override</Label>
              <Select value={context.season || 'auto'} onValueChange={(value) => 
                setContext(prev => ({ ...prev, season: value === 'auto' ? undefined : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto (weather)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (weather)</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Avoid repeat items (days): {context.avoidRepeatDays}</Label>
            <Slider
              value={[context.avoidRepeatDays || 0]}
              onValueChange={([value]) => setContext(prev => ({ ...prev, avoidRepeatDays: value }))}
              max={7}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <Button 
            onClick={handleGenerateOutfit}
            disabled={isGenerating || items.length === 0}
            className="w-full bg-gradient-to-r from-primary to-primary-glow"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Outfit
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Suggested Outfit */}
      {suggestedOutfit && (
        <Card className="p-6 bg-gradient-to-br from-card via-card/50 to-fashion-cream/20 border-2 border-primary/20">
          <div className="space-y-4">
            {/* Outfit Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Suggested Outfit</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{context.goal}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Score: {Math.round(suggestedOutfit.score * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleFavoriteOutfit}>
                  <Heart className="w-4 h-4 mr-1" />
                  Favorite
                </Button>
                <Button size="sm" onClick={handleSaveOutfit}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {outfitItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="aspect-square bg-background rounded-lg overflow-hidden border">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <Alert>
              <Sparkles className="w-4 h-4" />
              <AlertDescription>
                <strong>Why this combination?</strong> {suggestedOutfit.explanation}
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      )}

      {/* Style Assistant Chat */}
      <StyleChatbot 
        userItems={items}
        currentContext={context}
        onSuggestOutfit={(suggestedItems) => {
          // Convert items to outfit format
          const outfit = {
            id: `suggested_${Date.now()}`,
            userId: currentUser.id,
            itemIds: suggestedItems.map(item => item.id),
            context: {
              date: new Date().toISOString(),
              goal: context.goal,
              weather: getWeatherData().today
            },
            explanation: "Outfit suggested by AI assistant",
            score: 0.85
          };
          setSuggestedOutfit(outfit);
          toast({
            title: "Outfit Applied!",
            description: "The AI suggestion has been applied to your outfit preview."
          });
        }}
      />

      {/* No items warning */}
      {items.length === 0 && (
        <Alert>
          <AlertDescription>
            Your wardrobe is empty. Add some items to start getting outfit suggestions!
          </AlertDescription>
        </Alert>
      )}
        </>
      ) : (
        <div className="space-y-6">
          {/* Wardrobe Analysis */}
          <WardrobeAnalysis
            userItems={items}
            gaps={wardrobeGaps}
            onViewGap={handleViewGap}
          />

          {/* Shopping Suggestions */}
          {wardrobeGaps.length > 0 && (
            <ShoppingSuggestions
              gaps={wardrobeGaps}
              onConsultStylist={handleConsultStylist}
            />
          )}

          {/* No gaps found */}
          {wardrobeGaps.length === 0 && (
            <Card className="p-8 text-center">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tủ đồ hoàn hảo!</h3>
              <p className="text-muted-foreground">
                AI không phát hiện thiếu hụt nào trong tủ đồ của bạn. Bạn có thể tạo ra nhiều outfit đa dạng!
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}