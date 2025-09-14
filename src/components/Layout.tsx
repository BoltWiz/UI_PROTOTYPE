import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Shirt, 
  Sparkles, 
  Calendar, 
  History, 
  Heart, 
  Users, 
  Shield,
  LogOut,
  Image,
  MessageSquare,
  Trophy
} from 'lucide-react';
import { getCurrentUser } from '@/lib/mock';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InboxDrawer } from '@/components/chat/InboxDrawer';
import { getTotalUnreadCount } from '@/lib/chat';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: '/wardrobe', label: 'Wardrobe', icon: Shirt },
  { path: '/suggest', label: 'Suggest', icon: Sparkles },
  { path: '/daily', label: 'Daily', icon: Calendar },
  { path: '/history', label: 'History', icon: History },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/collections', label: 'Collections', icon: Image },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/challenges', label: 'Challenges', icon: Trophy },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Add role-specific routes  
  let navItems = [...navigationItems];
  if (currentUser.role === 'admin') {
    navItems = [...navItems, { path: '/admin/dashboard', label: 'Admin', icon: Shield }];
  } else if (currentUser.role === 'stylist') {
    navItems = [...navItems, { path: '/stylist', label: 'Stylist Studio', icon: Sparkles }];
  }

  const { logout } = useAuth();

  useEffect(() => {
    // Update unread count on mount and periodically
    const updateUnreadCount = () => {
      const count = getTotalUnreadCount();
      setUnreadCount(count);
    };

    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-fashion-cream to-secondary/50">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/wardrobe" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-primary-foreground">So</span>
                <span className="text-accent">P</span>
              </div>
              <span className="font-bold text-lg text-primary-foreground">
                Smart Outfit Planner
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Inbox */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsInboxOpen(true)}
              >
                <MessageSquare className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-fashion-rose to-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden sm:inline text-sm text-foreground">
                {currentUser.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="ml-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Inbox Drawer */}
      <InboxDrawer
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </div>
  );
}