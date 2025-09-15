import { useState, useEffect } from 'react';
import { User, Settings, Trophy, Heart, Calendar, Star, Edit, Camera, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Challenge, ChallengeEntry } from '@/types/challenges';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface UserChallengeEntry extends ChallengeEntry {
  challenge: Challenge;
  post?: {
    id: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
  };
  result?: {
    position?: number;
    badge?: string;
    points?: number;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: user?.defaultCity || '',
    styleGoals: user?.styleGoals || [],
    preferredColors: user?.preferredColors || [],
    avoidedColors: user?.avoidedColors || []
  });
  
  // Challenge History Data
  const [challengeEntries, setChallengeEntries] = useState<UserChallengeEntry[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [challengeStats, setChallengeStats] = useState({
    totalParticipated: 0,
    totalWins: 0,
    totalPoints: 0,
    currentStreak: 0
  });

  // Profile Stats
  const [profileStats, setProfileStats] = useState({
    totalOutfits: 0,
    favoriteOutfits: 0,
    wardrobeItems: 0,
    communityPosts: 0
  });

  useEffect(() => {
    loadProfileData();
    loadChallengeHistory();
  }, [user]);

  const loadProfileData = () => {
    // Mock profile stats
    setProfileStats({
      totalOutfits: 45,
      favoriteOutfits: 12,
      wardrobeItems: 28,
      communityPosts: 8
    });
  };

  const loadChallengeHistory = async () => {
    // Mock user challenge entries
    const mockEntries: UserChallengeEntry[] = [
      {
        id: 'uce1',
        challengeId: 'c1',
        postId: 'challenge-post-1',
        userId: user?.id || 'u1',
        status: 'submitted',
        createdAt: '2024-09-05T14:30:00Z',
        challenge: {
          id: 'c1',
          slug: 'autumn-layers-2024',
          title: 'Autumn Layers Challenge',
          brief: 'Show us your best layering techniques for the autumn season!',
          cover: '/mock/outfit1.jpg',
          hashtag: '#AutumnLayers2024',
          curatorId: 's1',
          startAt: '2024-09-01T00:00:00Z',
          endAt: '2024-09-30T23:59:59Z',
          status: 'ended',
          rules: [],
          createdAt: '2024-08-15T10:00:00Z',
          updatedAt: '2024-08-15T10:00:00Z'
        },
        post: {
          id: 'challenge-post-1',
          image: '/mock/outfit1.jpg',
          caption: 'My autumn layering look with cozy sweater and tailored coat! 🍂',
          likes: 45,
          comments: 8
        },
        result: {
          position: 2,
          badge: 'Silver Medal',
          points: 150
        }
      },
      {
        id: 'uce2',
        challengeId: 'c2',
        postId: 'challenge-post-2',
        userId: user?.id || 'u1',
        status: 'submitted',
        createdAt: '2024-09-16T09:45:00Z',
        challenge: {
          id: 'c2',
          slug: 'minimalist-monday',
          title: 'Minimalist Monday',
          brief: 'Less is more! Create stunning outfits using minimal pieces.',
          cover: '/mock/outfit2.jpg',
          hashtag: '#MinimalistMonday',
          startAt: '2024-09-15T00:00:00Z',
          endAt: '2024-10-15T23:59:59Z',
          status: 'active',
          rules: [],
          createdAt: '2024-09-01T09:00:00Z',
          updatedAt: '2024-09-01T09:00:00Z'
        },
        post: {
          id: 'challenge-post-2',
          image: '/mock/outfit2.jpg',
          caption: 'Clean minimalist look with just 3 pieces! #MinimalistMonday',
          likes: 67,
          comments: 12
        }
      }
    ];

    setChallengeEntries(mockEntries);

    // Mock badges earned
    const mockBadges = [
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
    ];

    setBadges(mockBadges);

    // Calculate challenge stats
    const totalParticipated = mockEntries.length;
    const totalWins = mockEntries.filter(entry => entry.result?.position && entry.result.position <= 3).length;
    const totalPoints = mockEntries.reduce((sum, entry) => sum + (entry.result?.points || 0), 0);
    
    setChallengeStats({
      totalParticipated,
      totalWins,
      totalPoints,
      currentStreak: 2
    });
  };

  const handleSaveProfile = () => {
    // Mock save functionality
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully."
    });
  };

  const getPositionBadge = (position?: number) => {
    if (!position) return null;
    
    const badges = {
      1: { icon: '🥇', label: 'Winner', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      2: { icon: '🥈', label: '2nd Place', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      3: { icon: '🥉', label: '3rd Place', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    };
    
    const badge = badges[position as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <Badge className={badge.color}>
        {badge.icon} {badge.label}
      </Badge>
    );
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your account, view achievements, and track your style journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="w-fit mx-auto mt-2">
                {user?.role === 'admin' ? 'Administrator' : 
                 user?.role === 'stylist' ? 'Stylist' : 'Fashion Enthusiast'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{profileStats.totalOutfits}</div>
                  <div className="text-xs text-muted-foreground">Outfits</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{profileStats.wardrobeItems}</div>
                  <div className="text-xs text-muted-foreground">Items</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{profileStats.favoriteOutfits}</div>
                  <div className="text-xs text-muted-foreground">Favorites</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
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
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${getBadgeRarityColor(badge.rarity)}`}
                      title={badge.name}
                    >
                      {badge.icon}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline" 
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="challenges">My Challenges</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Style Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Style Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Style Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.styleGoals.map((goal) => (
                        <Badge key={goal} variant="secondary">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Preferred Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.preferredColors.map((color) => (
                        <Badge key={color} variant="outline">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Avoided Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.avoidedColors.map((color) => (
                        <Badge key={color} variant="destructive" className="opacity-60">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Joined Minimalist Monday Challenge</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Heart className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Added 3 outfits to favorites</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Star className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Earned "Autumn Expert" badge</p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              {/* Challenge Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold">{challengeStats.totalParticipated}</div>
                    <div className="text-xs text-muted-foreground">Challenges Joined</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-xl font-bold">{challengeStats.totalWins}</div>
                    <div className="text-xs text-muted-foreground">Top 3 Finishes</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-xl font-bold">{challengeStats.totalPoints}</div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-xl font-bold">{challengeStats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Current Streak</div>
                  </CardContent>
                </Card>
              </div>

              {/* Challenge Entries */}
              <Card>
                <CardHeader>
                  <CardTitle>My Challenge Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {challengeEntries.length > 0 ? (
                    <div className="space-y-4">
                      {challengeEntries.map((entry) => (
                        <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <img 
                            src={entry.post?.image || entry.challenge.cover} 
                            alt={entry.challenge.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{entry.challenge.title}</h4>
                                <p className="text-sm text-muted-foreground">{entry.challenge.hashtag}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={
                                  entry.challenge.status === 'active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }>
                                  {entry.challenge.status}
                                </Badge>
                                {entry.result?.position && getPositionBadge(entry.result.position)}
                              </div>
                            </div>
                            
                            {entry.post && (
                              <p className="text-sm italic text-muted-foreground line-clamp-1">
                                "{entry.post.caption}"
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Joined {format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
                                {entry.post && (
                                  <>
                                    <span>{entry.post.likes} likes</span>
                                    <span>{entry.post.comments} comments</span>
                                  </>
                                )}
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/challenges/${entry.challenge.slug}`}>
                                  View Challenge
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Challenge History</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't participated in any challenges yet.
                      </p>
                      <Button asChild>
                        <Link to="/challenges">
                          <Trophy className="w-4 h-4 mr-2" />
                          Browse Challenges
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Badge Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {badges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {badges.map((badge) => (
                        <div key={badge.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${getBadgeRarityColor(badge.rarity)}`}>
                            {badge.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{badge.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {badge.rarity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(badge.earnedAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
                      <p className="text-muted-foreground">
                        Participate in challenges to earn your first badge!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about your style..."
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your city"
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveProfile}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about your style..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Your city"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}