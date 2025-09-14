import { useState, useEffect } from 'react';
import { Plus, Trophy, Users, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/types/challenges';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'ended'>('active');
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
  }, [activeTab]);

  const loadChallenges = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const response = await fetch('/src/data/challenges.json');
      const data = await response.json();
      
      const filteredChallenges = data.filter((challenge: Challenge) => 
        challenge.status === activeTab
      );
      
      setChallenges(filteredChallenges);
    } catch (error) {
      console.error('Failed to load challenges:', error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const getStatusBadge = (status: Challenge['status']) => {
    const variants = {
      active: 'default',
      upcoming: 'secondary', 
      ended: 'outline'
    } as const;
    
    const colors = {
      active: 'bg-green-500/10 text-green-700 border-green-200',
      upcoming: 'bg-blue-500/10 text-blue-700 border-blue-200',
      ended: 'bg-gray-500/10 text-gray-700 border-gray-200'
    };

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Style Challenges
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Join community challenges and showcase your style
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <Button asChild>
              <Link to="/admin/challenges">
                <Plus className="w-4 h-4 mr-2" />
                Manage Challenges
              </Link>
            </Button>
          )}
        </div>

        {/* Weekly Challenge Widget */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">This Week's Featured Challenge</h3>
                  <p className="text-muted-foreground">Join now and win amazing prizes!</p>
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary">Featured</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {challenges.find(c => c.status === 'active') ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    {challenges.find(c => c.status === 'active')?.title}
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    {challenges.find(c => c.status === 'active')?.brief}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>15 participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{getDaysRemaining(challenges.find(c => c.status === 'active')?.endAt || '')} days left</span>
                    </div>
                  </div>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to={`/challenges/${challenges.find(c => c.status === 'active')?.slug}`}>
                    Join Challenge
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No active challenges at the moment</p>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          {(['active', 'upcoming', 'ended'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : challenges.length > 0 ? (
            challenges.map((challenge) => (
              <Card key={challenge.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={challenge.cover} 
                    alt={challenge.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(challenge.status)}
                  </div>
                  {challenge.curatorId && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        Curated
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {challenge.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {challenge.brief}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {challenge.status === 'upcoming' 
                            ? `Starts ${format(new Date(challenge.startAt), 'MMM d')}`
                            : challenge.status === 'active'
                            ? `${getDaysRemaining(challenge.endAt)} days left`
                            : `Ended ${format(new Date(challenge.endAt), 'MMM d')}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {challenge.hashtag}
                      </Badge>
                      {challenge.prizes && challenge.prizes.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Trophy className="w-3 h-3 mr-1" />
                          Prizes
                        </Badge>
                      )}
                    </div>
                    
                    <Button asChild className="w-full" variant={challenge.status === 'active' ? 'default' : 'outline'}>
                      <Link to={`/challenges/${challenge.slug}`}>
                        {challenge.status === 'active' ? 'Join Challenge' : 'View Details'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="space-y-4 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">No {activeTab} challenges</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'active' 
                    ? 'No challenges are currently running. Check back soon!'
                    : activeTab === 'upcoming'
                    ? 'No upcoming challenges scheduled yet.'
                    : 'No past challenges to display.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}