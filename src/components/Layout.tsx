import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Trophy,
  User,
  Settings,
  Camera,
  Star,
  Edit
} from 'lucide-react';
import { getCurrentUser } from '@/lib/mock';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { InboxDrawer } from '@/components/chat/InboxDrawer';
import { getTotalUnreadCount } from '@/lib/chat';
import { format } from 'date-fns';

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
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    bio: '',
    location: currentUser.defaultCity || '',
    styleGoals: currentUser.styleGoals || [],
    preferredColors: currentUser.preferredColors || [],
    avoidedColors: currentUser.avoidedColors || []
  });
  const [challengeStats, setChallengeStats] = useState({
    totalParticipated: 2,
    totalWins: 1,
    totalPoints: 350,
    currentStreak: 2
  });
  const [badges, setBadges] = useState([
    {
      id: 'badge1',
      name: 'Autumn Expert',
      description: 'Won 2nd place in Autumn Layers Challenge',
      icon: '🍂',
      rarity: 'rare',
      earnedAt: '2024-09-30T18:00:00Z'
    },
    {
      id: 'badge2',
      name: 'First Timer',
      description: 'Participated in your first challenge',
      icon: '🌟',
      rarity: 'common',
      earnedAt: '2024-09-05T14:30:00Z'
    },
    {
      id: 'badge3',
      name: 'Style Streak',
      description: 'Participated in 2 consecutive challenges',
      icon: '🔥',
      rarity: 'uncommon',
      earnedAt: '2024-09-16T09:45:00Z'
    }
  ]);
  
  // Add role-specific routes  
  let navItems = [...navigationItems];
  if (currentUser.role === 'admin') {
    navItems = [...navItems, { path: '/admin/dashboard', label: 'Admin', icon: Shield }];
  } else if (currentUser.role === 'stylist') {
    navItems = [...navItems, { path: '/stylist', label: 'Stylist Studio', icon: Sparkles }];
  }

  const { logout } = useAuth();
  const { toast } = useToast();

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

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully."
    });
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-400 to-blue-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white';
      case 'uncommon': return 'bg-gradient-to-r from-green-400 to-emerald-400 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

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

            {/* User Profile Dropdown */}
            <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-secondary/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-fashion-rose to-accent rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm text-foreground">
                    {currentUser.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 p-0">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                              {currentUser.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute -bottom-1 -right-1 rounded-full h-6 w-6 p-0"
                          >
                            <Camera className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <h3 className="font-semibold">{currentUser.name}</h3>
                          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {currentUser.role === 'admin' ? 'Administrator' : 
                             currentUser.role === 'stylist' ? 'Stylist' : 'Fashion Enthusiast'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                        <TabsTrigger value="challenges" className="text-xs">Challenges</TabsTrigger>
                        <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="text-lg font-bold">45</div>
                            <div className="text-xs text-muted-foreground">Outfits</div>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="text-lg font-bold">28</div>
                            <div className="text-xs text-muted-foreground">Items</div>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="text-lg font-bold">12</div>
                            <div className="text-xs text-muted-foreground">Favorites</div>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="text-lg font-bold">{challengeStats.totalPoints}</div>
                            <div className="text-xs text-muted-foreground">Points</div>
                          </div>
                        </div>

                        {/* Recent Badges */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Recent Badges</h4>
                          <div className="flex gap-2">
                            {badges.slice(0, 3).map((badge) => (
                              <div
                                key={badge.id}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getBadgeRarityColor(badge.rarity)}`}
                                title={badge.name}
                              >
                                {badge.icon}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Style Preferences */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Style Goals</h4>
                          <div className="flex flex-wrap gap-1">
                            {profileData.styleGoals.map((goal) => (
                              <Badge key={goal} variant="secondary" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* My Challenges Tab */}
                      <TabsContent value="challenges" className="space-y-4 mt-4">
                        {/* Challenge Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                            <Trophy className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                            <div className="text-sm font-bold">{challengeStats.totalParticipated}</div>
                            <div className="text-xs text-muted-foreground">Joined</div>
                          </div>
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-center">
                            <Star className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                            <div className="text-sm font-bold">{challengeStats.totalWins}</div>
                            <div className="text-xs text-muted-foreground">Wins</div>
                          </div>
                        </div>

                        {/* Recent Challenge */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Latest Challenge</h4>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <img 
                              src="/mock/outfit1.jpg" 
                              alt="Challenge entry"
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">Autumn Layers Challenge</p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gray-100 text-gray-800 text-xs">
                                  🥈 2nd Place
                                </Badge>
                                <span className="text-xs text-muted-foreground">+150 pts</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to="/challenges">
                            <Trophy className="w-4 h-4 mr-2" />
                            View All Challenges
                          </Link>
                        </Button>
                      </TabsContent>

                      {/* Settings Tab */}
                      <TabsContent value="settings" className="space-y-4 mt-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="edit-name" className="text-xs">Name</Label>
                              <Input
                                id="edit-name"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-bio" className="text-xs">Bio</Label>
                              <Textarea
                                id="edit-bio"
                                value={profileData.bio}
                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell us about your style..."
                                className="h-16 text-sm resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 h-8 text-xs"
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm"
                                onClick={handleSaveProfile}
                                className="flex-1 h-8 text-xs"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Bio</Label>
                              <p className="text-sm">
                                {profileData.bio || 'No bio added yet'}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Location</Label>
                              <p className="text-sm">{profileData.location || 'Not specified'}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setIsEditing(true)}
                              className="w-full h-8 text-xs"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit Profile
                            </Button>
                          </div>
                        )}
                        
                        <div className="pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="w-full h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <LogOut className="w-3 h-3 mr-1" />
                            Logout
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </DropdownMenuContent>
            </DropdownMenu>
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