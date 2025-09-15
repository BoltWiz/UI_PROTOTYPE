import { useState } from 'react';
import { Check, Star, Crown, Sparkles, MessageCircle, Calendar, CreditCard, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
  aiSuggestions: number;
  stylistChats: number;
  consultations: number;
  popular?: boolean;
}

interface StylistConsultation {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviews: number;
  pricePerSession: number;
  availability: string[];
  isVerified: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'VND',
    period: 'tháng',
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-gray-100 to-gray-200',
    features: [
      '5 AI outfit suggestions/tháng',
      'Quản lý tủ đồ cơ bản',
      'Xem collections công khai',
      'Tham gia community'
    ],
    aiSuggestions: 5,
    stylistChats: 0,
    consultations: 0
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99000,
    currency: 'VND',
    period: 'tháng',
    icon: <Star className="w-6 h-6" />,
    gradient: 'from-blue-100 to-purple-100',
    features: [
      'Không giới hạn AI suggestions',
      'Chat với stylist (5 cuộc/tháng)',
      'Phân tích tủ đồ chi tiết',
      'Lưu outfit không giới hạn',
      'Ưu tiên hỗ trợ'
    ],
    aiSuggestions: -1, // unlimited
    stylistChats: 5,
    consultations: 1,
    popular: true
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 199000,
    currency: 'VND',
    period: 'tháng',
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-yellow-100 to-orange-100',
    features: [
      'Tất cả tính năng Premium',
      'Chat stylist không giới hạn',
      '3 phiên tư vấn 1-1/tháng',
      'Tạo collections riêng',
      'Phân tích xu hướng',
      'Hỗ trợ ưu tiên 24/7'
    ],
    aiSuggestions: -1,
    stylistChats: -1,
    consultations: 3
  }
];

const availableStylists: StylistConsultation[] = [
  {
    id: 's1',
    name: 'Emma Style',
    avatar: '',
    specialties: ['Corporate', 'Minimalist', 'Color Analysis'],
    rating: 4.9,
    reviews: 127,
    pricePerSession: 299000,
    availability: ['Mon', 'Wed', 'Fri'],
    isVerified: true
  },
  {
    id: 's2',
    name: 'Sarah Chen',
    avatar: '',
    specialties: ['Casual', 'Streetwear', 'Sustainable Fashion'],
    rating: 4.8,
    reviews: 89,
    pricePerSession: 249000,
    availability: ['Tue', 'Thu', 'Sat'],
    isVerified: true
  },
  {
    id: 's3',
    name: 'Alex Rivera',
    avatar: '',
    specialties: ['Formal', 'Evening', 'Luxury'],
    rating: 4.9,
    reviews: 156,
    pricePerSession: 399000,
    availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    isVerified: true
  }
];

export default function Subscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [selectedStylist, setSelectedStylist] = useState<StylistConsultation | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '60',
    topic: '',
    notes: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubscribe = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;

    if (plan.id === 'free') {
      toast({
        title: "Đã kích hoạt gói Free",
        description: "Bạn có thể sử dụng các tính năng cơ bản ngay bây giờ!"
      });
      return;
    }

    // Mock payment process
    toast({
      title: "Chuyển hướng thanh toán",
      description: `Đang xử lý thanh toán cho gói ${plan.name}...`
    });
  };

  const handleBookConsultation = (stylist: StylistConsultation) => {
    setSelectedStylist(stylist);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedStylist || !bookingData.date || !bookingData.time) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ ngày và giờ tư vấn",
        variant: "destructive"
      });
      return;
    }

    // Mock booking process
    toast({
      title: "Đặt lịch thành công!",
      description: `Phiên tư vấn với ${selectedStylist.name} đã được đặt cho ${bookingData.date} lúc ${bookingData.time}`
    });

    setIsBookingOpen(false);
    setBookingData({ date: '', time: '', duration: '60', topic: '', notes: '' });
    setSelectedStylist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Nâng cấp trải nghiệm
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chọn gói phù hợp để tận dụng tối đa AI và tư vấn từ stylist chuyên nghiệp
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              } ${selectedPlan === plan.id ? 'ring-2 ring-accent' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-center py-2 text-sm font-medium">
                  🔥 Phổ biến nhất
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price === 0 ? 'Miễn phí' : formatPrice(plan.price)}
                  {plan.price > 0 && <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Usage Limits */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>AI Suggestions</span>
                    <span className="font-medium">
                      {plan.aiSuggestions === -1 ? 'Không giới hạn' : `${plan.aiSuggestions}/tháng`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Chat Stylist</span>
                    <span className="font-medium">
                      {plan.stylistChats === -1 ? 'Không giới hạn' : plan.stylistChats === 0 ? 'Không có' : `${plan.stylistChats}/tháng`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tư vấn 1-1</span>
                    <span className="font-medium">
                      {plan.consultations === 0 ? 'Không có' : `${plan.consultations}/tháng`}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-accent' : ''}`}
                  variant={plan.id === 'free' ? 'outline' : 'default'}
                >
                  {plan.id === 'free' ? 'Sử dụng miễn phí' : `Chọn gói ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stylist Consultation Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Tư vấn cá nhân với Stylist</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Đặt lịch tư vấn 1-1 với stylist chuyên nghiệp để có lời khuyên phù hợp nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableStylists.map((stylist) => (
              <Card key={stylist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-white">
                        {stylist.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold">{stylist.name}</h3>
                      {stylist.isVerified && (
                        <Badge className="bg-gradient-to-r from-accent to-primary text-white">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{stylist.rating}</span>
                      <span>({stylist.reviews} đánh giá)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Chuyên môn</h4>
                      <div className="flex flex-wrap gap-1">
                        {stylist.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Lịch trống</h4>
                      <div className="flex gap-1">
                        {stylist.availability.map((day) => (
                          <Badge key={day} variant="secondary" className="text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(stylist.pricePerSession)}
                      </div>
                      <div className="text-sm text-muted-foreground">per session (60 phút)</div>
                    </div>

                    <Button 
                      onClick={() => handleBookConsultation(stylist)}
                      className="w-full bg-gradient-to-r from-primary to-accent"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Đặt lịch tư vấn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Đặt lịch tư vấn với {selectedStylist?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Stylist Info */}
              {selectedStylist && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {selectedStylist.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{selectedStylist.name}</h4>
                      <Badge className="bg-gradient-to-r from-accent to-primary text-white">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedStylist.rating} ({selectedStylist.reviews} đánh giá)</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {formatPrice(selectedStylist.pricePerSession)} / 60 phút
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Ngày tư vấn</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Giờ tư vấn</Label>
                  <Select value={bookingData.time} onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Thời lượng</Label>
                <Select value={bookingData.duration} onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 phút - {selectedStylist && formatPrice(selectedStylist.pricePerSession * 0.5)}</SelectItem>
                    <SelectItem value="60">60 phút - {selectedStylist && formatPrice(selectedStylist.pricePerSession)}</SelectItem>
                    <SelectItem value="90">90 phút - {selectedStylist && formatPrice(selectedStylist.pricePerSession * 1.5)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="topic">Chủ đề tư vấn</Label>
                <Input
                  id="topic"
                  value={bookingData.topic}
                  onChange={(e) => setBookingData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="VD: Tư vấn outfit công sở, phối màu, shopping..."
                />
              </div>

              <div>
                <Label htmlFor="notes">Ghi chú thêm (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Mô tả chi tiết về nhu cầu tư vấn của bạn..."
                  rows={3}
                />
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2">Tóm tắt thanh toán</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Phiên tư vấn ({bookingData.duration} phút)</span>
                    <span className="font-medium">
                      {selectedStylist && formatPrice(
                        selectedStylist.pricePerSession * (parseInt(bookingData.duration) / 60)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí dịch vụ</span>
                    <span className="font-medium">Miễn phí</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {selectedStylist && formatPrice(
                        selectedStylist.pricePerSession * (parseInt(bookingData.duration) / 60)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Xác nhận & Thanh toán
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Benefits Section */}
        <div className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Tại sao nên nâng cấp?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">AI Thông minh</h4>
                <p className="text-sm text-muted-foreground">
                  Gợi ý outfit phù hợp với thời tiết, sự kiện và phong cách cá nhân
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Stylist Chuyên nghiệp</h4>
                <p className="text-sm text-muted-foreground">
                  Chat và tư vấn trực tiếp với stylist có kinh nghiệm và được xác minh
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Bảo mật & Tin cậy</h4>
                <p className="text-sm text-muted-foreground">
                  Thanh toán an toàn, bảo mật thông tin và cam kết chất lượng dịch vụ
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}