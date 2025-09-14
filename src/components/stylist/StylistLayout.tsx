import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  FolderOpen, 
  PenTool, 
  MessageCircle, 
  Users, 
  Settings,
  LogOut,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StylistLayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { title: 'Dashboard', href: '/stylist', icon: LayoutDashboard },
  { title: 'Collections', href: '/stylist/collections', icon: FolderOpen },
  { title: 'Tips Studio', href: '/stylist/tips', icon: PenTool },
  { title: 'Messages', href: '/stylist/requests', icon: MessageCircle },
  { title: 'Community Posts', href: '/stylist/posts', icon: Users },
  { title: 'Settings', href: '/stylist/settings', icon: Settings },
];

export function StylistLayout({ children }: StylistLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Stylist Studio
            </Badge>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search collections, tips..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.name}</span>
            </div>
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
      </header>

      <div className="container flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-background p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/stylist'}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}