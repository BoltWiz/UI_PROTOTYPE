import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, Calendar, History, Heart, Users, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/wardrobe');
  };

  const features = [
    {
      icon: Eye,
      title: 'Smart Wardrobe',
      description: 'Organize và quản lý tủ đồ thông minh'
    },
    {
      icon: Sparkles,
      title: 'AI Suggestions',
      description: 'Gợi ý outfit phù hợp với thời tiết và sự kiện'
    },
    {
      icon: Calendar,
      title: 'Daily Planner',
      description: 'Lên kế hoạch trang phục hàng ngày'
    },
    {
      icon: Image,
      title: 'Style Collections',
      description: 'Khám phá bộ sưu tập từ stylist chuyên nghiệp'
    },
    {
      icon: History,
      title: 'Outfit History',
      description: 'Theo dõi lịch sử và tránh lặp lại'
    },
    {
      icon: Heart,
      title: 'Favorites',
      description: 'Lưu những outfit yêu thích'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Chia sẻ và khám phá phong cách'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        {!showAuth ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="text-6xl font-bold">
                  <span className="text-primary">So</span>
                  <span className="text-accent">P</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Smart Outfit Planner
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ứng dụng AI giúp bạn lựa chọn trang phục hoàn hảo cho mọi dịp. 
                Thông minh, tiện lợi và phù hợp với phong cách của bạn.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-primary to-primary-glow text-lg px-8"
                >
                  Bắt đầu ngay
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/collections')}
                  className="text-lg px-8"
                >
                  <Image className="w-5 h-5 mr-2" />
                  Xem Collections
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleGuestLogin}
                  className="text-lg px-8"
                >
                  Dùng thử miễn phí
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </Card>
                );
              })}
            </div>

            {/* Benefits */}
            <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <h2 className="text-2xl font-bold text-primary mb-4">Tại sao chọn SOP?</h2>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge variant="secondary" className="text-sm py-1 px-3">AI thông minh</Badge>
                <Badge variant="secondary" className="text-sm py-1 px-3">Dễ sử dụng</Badge>
                <Badge variant="secondary" className="text-sm py-1 px-3">Tiết kiệm thời gian</Badge>
                <Badge variant="secondary" className="text-sm py-1 px-3">Phong cách cá nhân</Badge>
              </div>
              <p className="text-muted-foreground">
                Không còn phải lo lắng về việc "mặc gì hôm nay". SOP sẽ giúp bạn luôn tự tin với phong cách của mình.
              </p>
            </Card>
          </>
        ) : (
          <AuthForms onBack={() => setShowAuth(false)} />
        )}
      </div>
    </div>
  );
}

function AuthForms({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register, user } = useAuth();

  const getRoleBasedRedirect = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'stylist':
        return '/stylist';
      default:
        return '/wardrobe';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password);
      }

      if (success) {
        // Small delay to ensure user state is updated
        setTimeout(() => {
          if (user) {
            navigate(getRoleBasedRedirect(user.role));
          }
        }, 100);
      } else {
        setError(isLogin ? 'Email hoặc mật khẩu không đúng' : 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-8 bg-card/90 backdrop-blur-sm">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold mb-2">
          <span className="text-primary">So</span>
          <span className="text-accent">P</span>
        </div>
        <h2 className="text-2xl font-bold text-primary">
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {isLogin ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới'}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu</label>
          <input
            type="password"
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-primary-glow"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline"
        >
          {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:underline text-sm"
        >
          ← Quay lại trang chủ
        </button>
      </div>

      {isLogin && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
          <strong>Demo accounts:</strong><br/>
          User: minh@example.com / 123456<br/>
          Stylist: stylist@example.com / stylist123<br/>
          Admin: admin@example.com / admin123
        </div>
      )}
    </Card>
  );
}