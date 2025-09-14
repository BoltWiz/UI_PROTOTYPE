import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Clock, Calendar, Star, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Challenge, ChallengeEntry, ChallengeStats } from '@/types/challenges';
import { Post, User } from '@/types';
import { format } from 'date-fns';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { EnhancedPostCard } from '@/components/community/EnhancedPostCard';
import { CommunityTabs } from '@/components/community/CommunityTabs';

export default function ChallengeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [entries, setEntries] = useState<Post[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [curator, setCurator] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');

  useEffect(() => {
    if (slug) {
      loadChallengeData();
    }
  }, [slug]);

  const loadChallengeData = async () => {
    setIsLoading(true);
    
    try {
      // Load challenge data
      const challengeResponse = await fetch('/src/data/challenges.json');
      const challengesData = await challengeResponse.json();
      const challengeData = challengesData.find((c: Challenge) => c.slug === slug);
      
      if (!challengeData) {
        navigate('/challenges');
        return;
      }
      
      setChallenge(challengeData);
      
      // Load entries
      const entriesResponse = await fetch('/src/data/challenges.entries.json');
      const entriesData = await entriesResponse.json();
      const challengeEntries = entriesData.filter((entry: ChallengeEntry) => 
        entry.challengeId === challengeData.id
      );
      
      // Load posts for entries (mock)
      const mockPosts: Post[] = [
        {
          id: 'challenge-post-1',
          userId: 'u1',
          image: '/mock/outfit1.jpg',
          caption: `My entry for ${challengeData.hashtag}! Loving the layered look with this cozy sweater and tailored coat. Perfect autumn vibes! 🍂 #AutumnLayers2024`,
          tags: ['autumn', 'layers', 'cozy', 'challenge'],
          likes: 45,
          comments: [
            { userId: 'user-2', text: 'Amazing layering technique!', timestamp: new Date().toISOString() },
            { userId: 'user-3', text: 'Love the color combination', timestamp: new Date().toISOString() }
          ],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'visible',
          reports: []
        },
        {
          id: 'challenge-post-2', 
          userId: 'user-2',
          image: '/mock/beige-coat.jpg',
          caption: `Fall fashion at its finest! This beige coat is perfect for the ${challengeData.hashtag} challenge. Layered with a chunky knit for that cozy autumn feel 🧥`,
          tags: ['autumn', 'coat', 'layers', 'challenge'],
          likes: 67,
          comments: [
            { userId: 'u1', text: 'That coat is gorgeous!', timestamp: new Date().toISOString() }
          ],
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'visible',
          reports: []
        }
      ];
      
      setEntries(mockPosts);
      
      // Mock stats
      setStats({
        submissions: challengeEntries.length + 2,
        likes: 342,
        participants: 15,
        topContributors: [
          { userId: 'u1', name: 'Minh', submissions: 2, totalLikes: 45 },
          { userId: 'user-2', name: 'Emma Style', submissions: 1, totalLikes: 67 },
          { userId: 'user-3', name: 'Fashion Lover', submissions: 1, totalLikes: 28 }
        ]
      });
      
      // Check if user has joined
      if (user) {
        const userEntry = challengeEntries.find((entry: ChallengeEntry) => 
          entry.userId === user.id
        );
        setHasJoined(!!userEntry);
      }
      
      // Load curator info if exists
      if (challengeData.curatorId) {
        // Mock curator data
        setCurator({
          id: challengeData.curatorId,
          name: 'Emma Style',
          email: 'emma@example.com',
          role: 'stylist',
          bio: 'Fashion stylist with 8+ years experience',
          followerCount: 2500,
          isVerifiedStylist: true,
          specialties: ['formal', 'minimalist', 'corporate']
        });
      }
      
    } catch (error) {
      console.error('Failed to load challenge:', error);
      toast({
        title: "Error",
        description: "Failed to load challenge details",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleJoinChallenge = async () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (challenge?.status !== 'active') {
      toast({
        title: "Cannot join",
        description: "This challenge is not currently active",
        variant: "destructive"
      });
      return;
    }
    
    setIsJoining(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsNewPostOpen(true);
    setIsJoining(false);
  };

  const handleCreateChallengePost = (postData: { caption: string; tags: string[]; image: string }) => {
    if (!challenge || !user) return;
    
    // Add challenge hashtag if not already present
    const tags = [...postData.tags];
    if (!tags.includes(challenge.hashtag.replace('#', ''))) {
      tags.push(challenge.hashtag.replace('#', ''));
    }
    
    // Create new post with challenge entry
    const newPost: Post = {
      id: `challenge-entry-${Date.now()}`,
      userId: user.id,
      image: postData.image,
      caption: `${postData.caption} ${challenge.hashtag}`,
      tags,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      status: 'visible',
      reports: []
    };
    
    setEntries([newPost, ...entries]);
    setHasJoined(true);
    setIsNewPostOpen(false);
    
    toast({
      title: "Challenge entry submitted!",
      description: `Your post has been submitted to ${challenge.title}`,
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Challenge not found</h2>
            <Button onClick={() => navigate('/challenges')}>
              Back to Challenges
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/challenges')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>

        {/* Challenge Header */}
        <Card className="mb-8">
          <div className="aspect-[3/1] relative overflow-hidden rounded-t-lg">
            <img 
              src={challenge.cover} 
              alt={challenge.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex gap-2 mb-3">
                <Badge className={
                  challenge.status === 'active' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : challenge.status === 'upcoming'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </Badge>
                {curator && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Curated by {curator.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{challenge.title}</h1>
              <p className="text-xl opacity-90">{challenge.brief}</p>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{stats?.participants || 0} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{stats?.submissions || 0} submissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {challenge.status === 'active' 
                        ? `${getDaysRemaining(challenge.endAt)} days left`
                        : challenge.status === 'upcoming'
                        ? `Starts ${format(new Date(challenge.startAt), 'MMM d, yyyy')}`
                        : `Ended ${format(new Date(challenge.endAt), 'MMM d, yyyy')}`
                      }
                    </span>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <h3 className="font-semibold mb-3">Challenge Rules</h3>
                  <ul className="space-y-2">
                    {challenge.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prizes */}
                {challenge.prizes && challenge.prizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      Prizes
                    </h3>
                    <ul className="space-y-2">
                      {challenge.prizes.map((prize, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-yellow-600 mt-1">★</span>
                          <span>{prize}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Panel */}
              <div className="space-y-4">
                {challenge.status === 'active' && (
                  <div className="text-center">
                    {hasJoined ? (
                      <div className="space-y-3">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          ✓ Joined
                        </Badge>
                        <Button 
                          onClick={() => setIsNewPostOpen(true)}
                          className="w-full"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Entry
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleJoinChallenge}
                        disabled={isJoining || !isAuthenticated}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {isJoining ? 'Joining...' : 'Join Challenge'}
                      </Button>
                    )}
                  </div>
                )}

                {/* Curator Info */}
                {curator && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${curator.name}`} />
                        <AvatarFallback>{curator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{curator.name}</h4>
                          {curator.isVerifiedStylist && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Challenge Curator</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Hashtag */}
                <div className="text-center">
                  <Badge variant="outline" className="text-sm">
                    {challenge.hashtag}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard & Entries */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Tabs */}
            <CommunityTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Entries Feed */}
            <div className="space-y-6">
              {entries.length > 0 ? (
                entries.map((post) => (
                  <EnhancedPostCard
                    key={post.id}
                    post={post}
                    currentUser={user}
                    onLike={() => {}}
                    onReport={() => {}}
                    showChallengeEntry={true}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">No entries yet</h3>
                    <p className="text-muted-foreground">
                      Be the first to submit your style to this challenge!
                    </p>
                    {challenge.status === 'active' && (
                      <Button onClick={handleJoinChallenge}>
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Leaderboard */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Community Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topContributors.map((contributor, index) => (
                    <div key={contributor.userId} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.name}`} />
                        <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contributor.submissions} entries • {contributor.totalLikes} likes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {curator && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Curator's Picks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Coming soon - {curator.name} will select their favorite entries!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* New Post Dialog */}
        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogContent className="max-w-2xl">
            <NewPostDialog 
              onCreatePost={handleCreateChallengePost}
              challengeInfo={{
                title: challenge.title,
                hashtag: challenge.hashtag
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}