import { useState } from 'react';
import { ShoppingBag, MessageCircle, ExternalLink, Star, AlertCircle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MissingItem, ShoppingOption } from '@/types/suggestions';
import { formatPrice } from '@/lib/suggestions';
import { useToast } from '@/hooks/use-toast';

interface MissingItemCardProps {
  item: MissingItem;
  onShopNow: (option: ShoppingOption) => void;
  onConsultStylist: (stylistId: string) => void;
}

export function MissingItemCard({ item, onShopNow, onConsultStylist }: MissingItemCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Đã xóa khỏi wishlist" : "Đã thêm vào wishlist",
      description: isWishlisted ? "Item đã được xóa khỏi danh sách yêu thích" : "Item đã được lưu vào danh sách yêu thích"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const bestOption = item.shoppingOptions
    .filter(option => option.inStock)
    .sort((a, b) => b.similarityScore - a.similarityScore)[0];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge className={getPriorityColor(item.priority)}>
              {item.priority} priority
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlist}
              className={`h-8 w-8 p-0 bg-black/20 hover:bg-black/40 ${isWishlisted ? 'text-red-500' : 'text-white'}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {item.type}
            </Badge>
            <div className="text-right">
              <div className="text-sm font-semibold">
                {formatPrice(item.estimatedPrice.min)} - {formatPrice(item.estimatedPrice.max)}
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">{item.reason}</p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {item.occasions.map(occasion => (
                <Badge key={occasion} variant="secondary" className="text-xs">
                  {occasion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Best Shopping Option */}
          {bestOption && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Gợi ý tốt nhất</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {bestOption.similarityScore}% match
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{bestOption.productName}</p>
                  <p className="text-xs text-muted-foreground">{bestOption.retailer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(bestOption.price)}</p>
                  {bestOption.rating && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {bestOption.rating}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Xem shop
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <ShoppingOptionsModal 
                  item={item}
                  onShopNow={onShopNow}
                />
              </DialogContent>
            </Dialog>

            {item.stylistRecommendation && (
              <Button
                className="flex-1"
                onClick={() => onConsultStylist(item.stylistRecommendation!.stylistId)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Tư vấn stylist
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ShoppingOptionsModalProps {
  item: MissingItem;
  onShopNow: (option: ShoppingOption) => void;
}

function ShoppingOptionsModal({ item, onShopNow }: ShoppingOptionsModalProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-muted-foreground">Các lựa chọn mua sắm</p>
      </div>

      <div className="space-y-3">
        {item.shoppingOptions.map((option) => (
          <Card key={option.id} className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={option.imageUrl}
                alt={option.productName}
                className="w-20 h-20 object-cover rounded-lg"
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
      </div>
    </div>
  );
}