import { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, TrendingUp, MessageCircle, ExternalLink, Star, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MissingItem, ShoppingOption, WardrobeGap } from '@/types/suggestions';
import { formatPrice } from '@/lib/suggestions';
import { QuickChatModal } from '@/components/chat/QuickChatModal';
import { UserMini } from '@/types/chat';

interface ShoppingSuggestionsProps {
  gaps: WardrobeGap[];
  onConsultStylist: (stylistId: string) => void;
}

export function ShoppingSuggestions({ gaps, onConsultStylist }: ShoppingSuggestionsProps) {
  const [selectedItem, setSelectedItem] = useState<MissingItem | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<UserMini | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { toast } = useToast();

  const handleShopNow = (option: ShoppingOption) => {
    // In real app, this would open the retailer's website
    toast({
      title: "Chuyển hướng mua sắm",
      description: `Đang mở ${option.retailer} để xem sản phẩm ${option.productName}`,
    });
  };

  const handleConsultStylist = (item: MissingItem) => {
    if (item.stylistRecommendation) {
      const stylistData: UserMini = {
        id: item.stylistRecommendation.stylistId,
        name: item.stylistRecommendation.stylistName,
        role: 'stylist',
        isOnline: Math.random() > 0.5
      };
      setSelectedStylist(stylistData);
      setIsChatModalOpen(true);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Wardrobe Analysis</h2>
        </div>
        <p className="text-muted-foreground">
          Phân tích tủ đồ và gợi ý những item còn thiếu để tạo ra nhiều outfit đa dạng hơn
        </p>
      </div>

      {/* Gaps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gaps.map((gap) => (
          <Card key={gap.category} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{gap.category}</CardTitle>
                <Badge className={getPriorityColor(gap.impact)}>
                  {gap.impact} impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{gap.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span className={getImpactColor(gap.impact)}>{gap.completionScore}%</span>
                </div>
                <Progress value={gap.completionScore} className="h-2" />
              </div>

              <div className="space-y-2">
                {gap.missingItems.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.estimatedPrice.min)} - {formatPrice(item.estimatedPrice.max)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedItem(gap.missingItems[0])}
              >
                Xem chi tiết
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <ItemDetailModal 
              item={selectedItem}
              onShopNow={handleShopNow}
              onConsultStylist={() => handleConsultStylist(selectedItem)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Chat Modal */}
      {selectedStylist && (
        <QuickChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedStylist(null);
          }}
          stylist={selectedStylist}
        />
      )}
    </div>
  );
}

interface ItemDetailModalProps {
  item: MissingItem;
  onShopNow: (option: ShoppingOption) => void;
  onConsultStylist: () => void;
}

function ItemDetailModal({ item, onShopNow, onConsultStylist }: ItemDetailModalProps) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          {item.name}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item Info */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="capitalize">{item.type}</Badge>
              <Badge variant="outline" className={`${item.priority === 'high' ? 'border-red-200 text-red-700' : item.priority === 'medium' ? 'border-yellow-200 text-yellow-700' : 'border-green-200 text-green-700'}`}>
                {item.priority} priority
              </Badge>
            </div>

            <p className="text-muted-foreground">{item.description}</p>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Tại sao cần item này:</strong> {item.reason}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Phù hợp cho:</h4>
              <div className="flex flex-wrap gap-1">
                {item.occasions.map(occasion => (
                  <Badge key={occasion} variant="secondary" className="text-xs">
                    {occasion}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Màu sắc:</h4>
              <div className="flex gap-2">
                {item.colors.map(color => (
                  <div
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-border"
                    style={{ backgroundColor: color === 'white' ? '#ffffff' : color === 'navy' ? '#1e3a8a' : color === 'brown' ? '#92400e' : color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shopping Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Gợi ý mua sắm</h3>
            <div className="text-sm text-muted-foreground">
              {formatPrice(item.estimatedPrice.min)} - {formatPrice(item.estimatedPrice.max)}
            </div>
          </div>

          <Tabs defaultValue="shopping" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shopping">Mua sắm</TabsTrigger>
              <TabsTrigger value="stylist">Stylist</TabsTrigger>
            </TabsList>

            <TabsContent value="shopping" className="space-y-3">
              {item.shoppingOptions.map((option) => (
                <Card key={option.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <img
                      src={option.imageUrl}
                      alt={option.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{option.productName}</h4>
                          <p className="text-sm text-muted-foreground">{option.retailer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{formatPrice(option.price)}</p>
                          {option.rating && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {option.rating}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {option.similarityScore}% match
                          </Badge>
                          {!option.inStock && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Hết hàng
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onShopNow(option)}
                          disabled={!option.inStock}
                          className="gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Mua ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="stylist" className="space-y-4">
              {item.stylistRecommendation ? (
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {item.stylistRecommendation.stylistName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.stylistRecommendation.stylistName}</h4>
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Verified Stylist
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{item.stylistRecommendation.message}</p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Gợi ý thay thế:</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.stylistRecommendation.alternatives.map((alt, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onConsultStylist}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Tư vấn miễn phí
                      </Button>
                      <Button className="flex-1">
                        Đặt lịch hẹn
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Chưa có stylist tư vấn cho item này
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}