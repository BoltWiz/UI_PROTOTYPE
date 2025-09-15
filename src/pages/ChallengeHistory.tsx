import { useState, useEffect } from 'react';
import { Trophy, Calendar, Star, Medal, Award, Clock, Users, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
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

export default function ChallengeHistory() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<UserChallengeEntry[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalParticipated: 0,
    totalWins: 0,
    totalPoints: 0,
    currentStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChallengeHistory();
  }, [user]);

  const loadChallengeHistory = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
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

    setEntries(mockEntries);

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

    // Calculate stats
    const totalParticipated = mockEntries.length;
    const totalWins = mockEntries.filter(entry => entry.result?.position && entry.result.position <= 3).length;
    const totalPoints = mockEntries.reduce((sum, entry) => sum + (entry.result?.points || 0), 0);
    
    setStats({
      totalParticipated,
      totalWins,
      totalPoints,
      currentStreak: 2
    });

    setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Challenge History
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your journey through style challenges and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalParticipated}</div>
            <div className="text-sm text-muted-foreground">Challenges Joined</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
          <CardContent className="p-6 text-center">
            <Medal className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalWins}</div>
            <div className="text-sm text-muted-foreground">Top 3 Finishes</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entries" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
          <TabsTrigger value="entries">My Entries</TabsTrigger>
          <TabsTrigger value="badges">Badges & Awards</TabsTrigger>
        </TabsList>

        {/* Challenge Entries */}
        <TabsContent value="entries" className="space-y-6">
          {entries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={entry.post?.image || entry.challenge.cover} 
                      alt={entry.challenge.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={
                        entry.challenge.status === 'active' 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-500 hover:bg-gray-600'
                      }>
                        {entry.challenge.status}
                      </Badge>
                      {entry.result?.position && getPositionBadge(entry.result.position)}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{entry.challenge.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.challenge.brief}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        {entry.post && (
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {entry.post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {entry.post.comments}
                            </span>
                          </div>
                        )}
                      </div>

                      {entry.post && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm italic">"{entry.post.caption}"</p>
                        </div>
                      )}

                      {entry.result && (
                        <div className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Challenge Result</p>
                              <p className="text-sm text-muted-foreground">
                                {entry.result.badge} • {entry.result.points} points
                              </p>
                            </div>
                            {entry.result.position && entry.result.position <= 3 && (
                              <div className="text-2xl">
                                {entry.result.position === 1 ? '🥇' : 
                                 entry.result.position === 2 ? '🥈' : '🥉'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link to={`/challenges/${entry.challenge.slug}`}>
                            View Challenge
                          </Link>
                        </Button>
                        {entry.post && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            View Post
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">No Challenge History</h3>
              <p className="text-muted-foreground mb-6">
                You haven't participated in any challenges yet. Join your first challenge to start building your history!
              </p>
              <Button asChild className="bg-gradient-to-r from-primary to-accent">
                <Link to="/challenges">
                  <Trophy className="w-4 h-4 mr-2" />
                  Browse Challenges
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Badges & Awards */}
        <TabsContent value="badges" className="space-y-6">
          {badges.length > 0 ? (
            <>
              {/* Badge Collection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <Card key={badge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl ${getBadgeRarityColor(badge.rarity)}`}>
                        {badge.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                      <Badge variant="outline" className="capitalize">
                        {badge.rarity}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Earned {format(new Date(badge.earnedAt), 'MMM d, yyyy')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Achievement Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievement Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <p className="font-medium">Challenge Master</p>
                          <p className="text-sm text-muted-foreground">Win 5 challenges</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{stats.totalWins}/5</p>
                        <div className="w-24 bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.totalWins / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">⚡</div>
                        <div>
                          <p className="font-medium">Streak Legend</p>
                          <p className="text-sm text-muted-foreground">Maintain 10-challenge streak</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{stats.currentStreak}/10</p>
                        <div className="w-24 bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.currentStreak / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💎</div>
                        <div>
                          <p className="font-medium">Point Collector</p>
                          <p className="text-sm text-muted-foreground">Earn 1000 challenge points</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{stats.totalPoints}/1000</p>
                        <div className="w-24 bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.totalPoints / 1000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-16">
              <Award className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">No Badges Yet</h3>
              <p className="text-muted-foreground mb-6">
                Participate in challenges to earn badges and achievements!
              </p>
              <Button asChild className="bg-gradient-to-r from-primary to-accent">
                <Link to="/challenges">
                  <Trophy className="w-4 h-4 mr-2" />
                  Join Your First Challenge
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}