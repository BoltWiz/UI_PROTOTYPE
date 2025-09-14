import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, Image as ImageIcon, ThumbsUp, ThumbsDown, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Item, SuggestContext } from '@/types';
import { getWeatherData } from '@/lib/mock';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'outfit-suggestion' | 'style-tip' | 'weather-advice';
  outfitItems?: Item[];
  rating?: 'good' | 'bad' | null;
  quickReplies?: string[];
}

interface StyleChatbotProps {
  userItems: Item[];
  currentContext: SuggestContext;
  onSuggestOutfit?: (items: Item[]) => void;
}

export function StyleChatbot({ userItems, currentContext, onSuggestOutfit }: StyleChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your personal style assistant 👋 I can help you with outfit suggestions, styling tips, and fashion advice based on your wardrobe!',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      quickReplies: ['Suggest an outfit', 'Style tips for today', 'Color matching advice', 'What\'s trending?']
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const generateBotResponse = async (userMessage: string): Promise<ChatMessage> => {
    const weather = getWeatherData();
    const messageId = Date.now().toString();
    const lowerMessage = userMessage.toLowerCase();

    // Weather-based responses
    if (lowerMessage.includes('weather') || lowerMessage.includes('today')) {
      return {
        id: messageId,
        text: `Today's weather is ${weather.today.condition} with ${weather.today.tempC}°C. I'd recommend ${getWeatherAdvice(weather.today.condition, weather.today.tempC)}.`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'weather-advice',
        quickReplies: ['Show me options', 'Any color suggestions?', 'What about accessories?']
      };
    }

    // Outfit suggestion responses
    if (lowerMessage.includes('outfit') || lowerMessage.includes('wear') || lowerMessage.includes('suggest')) {
      const suggestedItems = getSmartOutfitSuggestion();
      return {
        id: messageId,
        text: `Based on your wardrobe and current preferences, here's what I suggest:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'outfit-suggestion',
        outfitItems: suggestedItems,
        quickReplies: ['Try another combination', 'Explain this choice', 'Save this outfit']
      };
    }

    // Color advice
    if (lowerMessage.includes('color') || lowerMessage.includes('match')) {
      return {
        id: messageId,
        text: getColorAdvice(),
        sender: 'bot',
        timestamp: new Date(),
        type: 'style-tip',
        quickReplies: ['Show color combinations', 'Seasonal colors', 'Bold vs subtle']
      };
    }

    // Style tips
    if (lowerMessage.includes('style') || lowerMessage.includes('tip') || lowerMessage.includes('fashion')) {
      return {
        id: messageId,
        text: getStyleTip(),
        sender: 'bot',
        timestamp: new Date(),
        type: 'style-tip',
        quickReplies: ['More tips', 'Occasion-specific advice', 'Body type tips']
      };
    }

    // Default responses
    const defaultResponses = [
      {
        text: "That's interesting! Let me help you style that. What occasion are you dressing for?",
        quickReplies: ['Work', 'Date night', 'Casual hangout', 'Special event']
      },
      {
        text: "Great question! Fashion is all about expressing yourself. What's your style personality?",
        quickReplies: ['Classic', 'Trendy', 'Edgy', 'Minimalist']
      },
      {
        text: "I'd love to help with that! Based on your wardrobe, I can suggest some combinations.",
        quickReplies: ['Show suggestions', 'Explain my style', 'Trend insights']
      }
    ];

    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    return {
      id: messageId,
      text: randomResponse.text,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      quickReplies: randomResponse.quickReplies
    };
  };

  const getWeatherAdvice = (condition: string, temp: number): string => {
    if (temp < 10) {
      return "layering with a warm coat and closed-toe shoes. Don't forget accessories like scarves!";
    } else if (temp < 20) {
      return "a light jacket or cardigan with comfortable pants and closed shoes.";
    } else if (temp < 30) {
      return "light, breathable fabrics. Perfect weather for your favorite casual outfits!";
    } else {
      return "light, airy clothing in light colors. Stay cool and comfortable!";
    }
  };

  const getSmartOutfitSuggestion = (): Item[] => {
    if (userItems.length === 0) return [];

    // Simple smart suggestion logic
    const tops = userItems.filter(item => item.type === 'top');
    const bottoms = userItems.filter(item => item.type === 'bottom');
    const shoes = userItems.filter(item => item.type === 'shoes');
    const outers = userItems.filter(item => item.type === 'outer');

    const suggestion: Item[] = [];
    
    if (tops.length > 0) suggestion.push(tops[Math.floor(Math.random() * tops.length)]);
    if (bottoms.length > 0) suggestion.push(bottoms[Math.floor(Math.random() * bottoms.length)]);
    if (shoes.length > 0) suggestion.push(shoes[Math.floor(Math.random() * shoes.length)]);
    if (outers.length > 0 && Math.random() > 0.5) suggestion.push(outers[Math.floor(Math.random() * outers.length)]);

    return suggestion;
  };

  const getColorAdvice = (): string => {
    const colorTips = [
      "Try the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent color for perfect balance!",
      "Complementary colors (opposite on color wheel) create striking combinations - like blue and orange!",
      "Monochromatic outfits using different shades of the same color always look sophisticated.",
      "Earth tones like beige, brown, and olive green work beautifully together for a natural look.",
      "When in doubt, add a pop of color through accessories - it's an easy way to brighten any outfit!"
    ];
    return colorTips[Math.floor(Math.random() * colorTips.length)];
  };

  const getStyleTip = (): string => {
    const styleTips = [
      "Fit is everything! A well-fitted basic outfit looks better than expensive clothes that don't fit properly.",
      "Invest in quality basics: white shirt, dark jeans, neutral blazer - they're the foundation of great style!",
      "Don't be afraid to mix textures - smooth silk with rough denim, or soft knits with structured pieces.",
      "Accessories can transform any outfit. A watch, belt, or statement jewelry can elevate your look instantly.",
      "Know your body type and dress to flatter your best features. Confidence is your best accessory!",
      "Less is often more - sometimes removing one accessory or piece makes the whole outfit better."
    ];
    return styleTips[Math.floor(Math.random() * styleTips.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsInputExpanded(false);
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const botResponse = await generateBotResponse(userMessage.text);
    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    handleSendMessage();
  };

  const handleRating = (messageId: string, rating: 'good' | 'bad') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
    
    toast({
      title: rating === 'good' ? "Thanks for the feedback!" : "We'll improve!",
      description: rating === 'good' ? "Glad I could help!" : "Your feedback helps me learn."
    });
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard"
    });
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep the initial greeting
    toast({
      title: "Chat cleared",
      description: "Starting fresh conversation"
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Style Assistant</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={message.sender === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}>
                  {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>

              <div className={`flex-1 space-y-2 ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.type && (
                    <div className="flex items-center gap-1 mb-2">
                      {message.type === 'weather-advice' && <Sparkles className="w-3 h-3" />}
                      {message.type === 'outfit-suggestion' && <ImageIcon className="w-3 h-3" />}
                      {message.type === 'style-tip' && <MessageSquare className="w-3 h-3" />}
                      <Badge variant="outline" className="text-xs">
                        {message.type.replace('-', ' ')}
                      </Badge>
                    </div>
                  )}
                  
                  <p className="text-sm">{message.text}</p>
                  
                  {message.outfitItems && message.outfitItems.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {message.outfitItems.map((item) => (
                          <div key={item.id} className="bg-background/50 rounded p-2 text-center">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 object-cover mx-auto rounded mb-1"
                            />
                            <p className="text-xs font-medium">{item.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {onSuggestOutfit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSuggestOutfit(message.outfitItems!)}
                          className="w-full"
                        >
                          Apply This Suggestion
                        </Button>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.sender === 'bot' && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyMessage(message.text)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRating(message.id, 'good')}
                        >
                          <ThumbsUp className={`w-3 h-3 ${message.rating === 'good' ? 'text-green-500' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRating(message.id, 'bad')}
                        >
                          <ThumbsDown className={`w-3 h-3 ${message.rating === 'bad' ? 'text-red-500' : ''}`} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {message.quickReplies && message.sender === 'bot' && (
                  <div className="flex flex-wrap gap-1">
                    {message.quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          {isInputExpanded ? (
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Ask about styling, outfits, colors, trends..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[60px]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInputExpanded(false)}
                >
                  Collapse
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="ml-auto"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Input
                placeholder="Ask me anything about style..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                onFocus={() => setIsInputExpanded(true)}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}