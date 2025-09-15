import { useState, useEffect } from 'react';
import { Plus, Trophy, Users, Calendar, Award, Crown, Medal, Star, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Challenge, ChallengeEntry, ChallengeResult } from '@/types/challenges';
import { format } from 'date-fns';

interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  postId: string;
  postImage: string;
  postCaption: string;
  likes: number;
  comments: number;
  submittedAt: string;
  isWinner?: boolean;
  isCuratorsPick?: boolean;
  position?: number;
}

export default function ChallengeManagement() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [curatorsPicks, setCuratorsPicks] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
    loadSubmissions();
  }, []);

  const loadChallenges = async () => {
    // Load challenges from JSON
    try {
      const response = await fetch('/src/data/challenges.json');
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  };

  const loadSubmissions = async () => {
    // Mock challenge submissions
    const mockSubmissions: ChallengeSubmission[] = [
      {
        id: 'sub1',
        challengeId: 'c1',
        userId: 'u1',
        userName: 'Minh',
        postId: 'p1',
        postImage: '/mock/outfit1.jpg',
        postCaption: 'My autumn layering look with cozy sweater and tailored coat! 🍂 #AutumnLayers2024',
        likes: 45,
        comments: 8,
        submittedAt: '2024-09-05T14:30:00Z'
      },
      {
        id: 'sub2',
        challengeId: 'c1',
        userId: 'user-2',
        userName: 'Emma Style',
        postId: 'p2',
        postImage: '/mock/beige-coat.jpg',
        postCaption: 'Fall fashion at its finest! This beige coat is perfect for layering 🧥 #AutumnLayers2024',
        likes: 67,
        comments: 12,
        submittedAt: '2024-09-07T10:15:00Z'
      },
      {
        id: 'sub3',
        challengeId: 'c1',
        userId: 'user-3',
        userName: 'Fashion Lover',
        postId: 'p3',
        postImage: '/mock/outfit2.jpg',
        postCaption: 'Layered perfection for autumn vibes! #AutumnLayers2024',
        likes: 28,
        comments: 5,
        submittedAt: '2024-09-10T16:20:00Z'
      }
    ];
    setSubmissions(mockSubmissions);
  };

  const handleCreateChallenge = (formData: any) => {
    const newChallenge: Challenge = {
      id: `c${Date.now()}`,
      slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title,
      brief: formData.brief,
      cover: formData.cover || '/mock/outfit1.jpg',
      hashtag: formData.hashtag,
      curatorId: formData.curatorId || undefined,
      startAt: formData.startAt,
      endAt: formData.endAt,
      status: 'upcoming',
      rules: formData.rules.split('\n').filter((rule: string) => rule.trim()),
      prizes: formData.prizes ? formData.prizes.split('\n').filter((prize: string) => prize.trim()) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setChallenges([newChallenge, ...challenges]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Challenge Created",
      description: `"${newChallenge.title}" has been created successfully`
    });
  };

  const handleFinalizeResults = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // Update challenge status to ended
    setChallenges(challenges.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'ended' as const, endAt: new Date().toISOString() }
        : c
    ));

    // Award badges to winners
    const challengeSubmissions = submissions.filter(s => s.challengeId === challengeId);
    const topSubmissions = challengeSubmissions
      .sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2))
      .slice(0, 3);

    // Mock badge awarding
    topSubmissions.forEach((submission, index) => {
      const badges = ['Gold Medal', 'Silver Medal', 'Bronze Medal'];
      const points = [300, 200, 100];
      
      console.log(`Awarding ${badges[index]} to ${submission.userName} for challenge ${challenge.title}`);
    });

    toast({
      title: "Results Finalized",
      description: `Winners have been selected and badges awarded for "${challenge.title}"`
    });

    setIsResultsDialogOpen(false);
    setSelectedChallenge(null);
  };

  const toggleWinner = (submissionId: string) => {
    setWinners(prev => 
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const toggleCuratorsPick = (submissionId: string) => {
    setCuratorsPicks(prev => 
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const getStatusBadge = (status: Challenge['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-700 border-green-200',
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      ended: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenge Management</h1>
          <p className="text-muted-foreground">Create, manage, and finalize community challenges</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="results">Results & Awards</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{challenges.length}</div>
                <div className="text-sm text-muted-foreground">Total Challenges</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{challenges.filter(c => c.status === 'active').length}</div>
                <div className="text-sm text-muted-foreground">Active Now</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{submissions.length}</div>
                <div className="text-sm text-muted-foreground">Total Submissions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Badges Awarded</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Challenge</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challenges.slice(0, 5).map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={challenge.cover} 
                            alt={challenge.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{challenge.title}</div>
                            <div className="text-sm text-muted-foreground">{challenge.hashtag}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(challenge.status)}</TableCell>
                      <TableCell>
                        {submissions.filter(s => s.challengeId === challenge.id).length}
                      </TableCell>
                      <TableCell>
                        {format(new Date(challenge.endAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {challenge.status === 'active' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedChallenge(challenge);
                                setIsResultsDialogOpen(true);
                              }}
                            >
                              Finalize
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Challenges */}
        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.filter(c => c.status === 'active').map((challenge) => {
              const challengeSubmissions = submissions.filter(s => s.challengeId === challenge.id);
              
              return (
                <Card key={challenge.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={challenge.cover} 
                      alt={challenge.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(challenge.status)}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {challenge.brief}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{challengeSubmissions.length} entries</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Ends {format(new Date(challenge.endAt), 'MMM d')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedChallenge(challenge);
                          setIsResultsDialogOpen(true);
                        }}
                      >
                        Manage Results
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Results & Awards */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Winners & Badge Awards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock recent awards */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="text-3xl">🥇</div>
                  <div className="flex-1">
                    <p className="font-medium">Emma Style won "Autumn Layers Challenge"</p>
                    <p className="text-sm text-muted-foreground">Awarded Gold Medal badge • 300 points</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    2 days ago
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="text-3xl">🥈</div>
                  <div className="flex-1">
                    <p className="font-medium">Minh placed 2nd in "Autumn Layers Challenge"</p>
                    <p className="text-sm text-muted-foreground">Awarded Silver Medal badge • 200 points</p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">
                    2 days ago
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="text-3xl">🥉</div>
                  <div className="flex-1">
                    <p className="font-medium">Fashion Lover placed 3rd in "Autumn Layers Challenge"</p>
                    <p className="text-sm text-muted-foreground">Awarded Bronze Medal badge • 100 points</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    2 days ago
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Challenge Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Challenge</DialogTitle>
          </DialogHeader>
          <CreateChallengeForm onSubmit={handleCreateChallenge} />
        </DialogContent>
      </Dialog>

      {/* Results Management Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Results: {selectedChallenge?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedChallenge && (
            <ResultsManagement
              challenge={selectedChallenge}
              submissions={submissions.filter(s => s.challengeId === selectedChallenge.id)}
              winners={winners}
              curatorsPicks={curatorsPicks}
              onToggleWinner={toggleWinner}
              onToggleCuratorsPick={toggleCuratorsPick}
              onFinalize={() => handleFinalizeResults(selectedChallenge.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Challenge Form Component
function CreateChallengeForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    brief: '',
    hashtag: '',
    curatorId: '',
    startAt: '',
    endAt: '',
    rules: '',
    prizes: '',
    cover: '/mock/outfit1.jpg'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Challenge Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., Winter Workplace Style"
            required
          />
        </div>

        <div>
          <Label htmlFor="hashtag">Hashtag</Label>
          <Input
            id="hashtag"
            value={formData.hashtag}
            onChange={(e) => setFormData({...formData, hashtag: e.target.value})}
            placeholder="e.g., #WinterWorkplace"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="brief">Brief Description</Label>
        <Textarea
          id="brief"
          value={formData.brief}
          onChange={(e) => setFormData({...formData, brief: e.target.value})}
          placeholder="Describe the challenge theme and what participants should create..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startAt">Start Date</Label>
          <Input
            id="startAt"
            type="datetime-local"
            value={formData.startAt}
            onChange={(e) => setFormData({...formData, startAt: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="endAt">End Date</Label>
          <Input
            id="endAt"
            type="datetime-local"
            value={formData.endAt}
            onChange={(e) => setFormData({...formData, endAt: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rules">Rules (one per line)</Label>
        <Textarea
          id="rules"
          value={formData.rules}
          onChange={(e) => setFormData({...formData, rules: e.target.value})}
          placeholder="Must include at least 2 layers in your outfit&#10;Use autumn colors (browns, oranges, deep reds, etc.)&#10;Include the hashtag in your post"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="prizes">Prizes (one per line, optional)</Label>
        <Textarea
          id="prizes"
          value={formData.prizes}
          onChange={(e) => setFormData({...formData, prizes: e.target.value})}
          placeholder="1st Place: $500 shopping voucher&#10;2nd Place: $300 shopping voucher&#10;3rd Place: $200 shopping voucher"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="curatorId">Curator (optional)</Label>
        <Select value={formData.curatorId} onValueChange={(value) => setFormData({...formData, curatorId: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select a stylist curator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No curator</SelectItem>
            <SelectItem value="s1">Emma Style</SelectItem>
            <SelectItem value="s2">Sarah Chen</SelectItem>
            <SelectItem value="s3">Alex Rivera</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Create Challenge
      </Button>
    </form>
  );
}

// Results Management Component
function ResultsManagement({ 
  challenge, 
  submissions, 
  winners, 
  curatorsPicks, 
  onToggleWinner, 
  onToggleCuratorsPick, 
  onFinalize 
}: {
  challenge: Challenge;
  submissions: ChallengeSubmission[];
  winners: string[];
  curatorsPicks: string[];
  onToggleWinner: (id: string) => void;
  onToggleCuratorsPick: (id: string) => void;
  onFinalize: () => void;
}) {
  const sortedSubmissions = [...submissions].sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Select Winners & Curator's Picks</h3>
        <p className="text-muted-foreground">
          Choose the top submissions and curator's favorite picks for "{challenge.title}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSubmissions.map((submission, index) => (
          <Card key={submission.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img 
                src={submission.postImage} 
                alt="Submission"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">
                  #{index + 1} by score
                </Badge>
              </div>
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <Button
                  size="sm"
                  variant={winners.includes(submission.id) ? "default" : "outline"}
                  onClick={() => onToggleWinner(submission.id)}
                  className="h-8 px-2"
                >
                  {winners.includes(submission.id) ? (
                    <><Crown className="w-3 h-3 mr-1" />Winner</>
                  ) : (
                    <Crown className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant={curatorsPicks.includes(submission.id) ? "default" : "outline"}
                  onClick={() => onToggleCuratorsPick(submission.id)}
                  className="h-8 px-2"
                >
                  {curatorsPicks.includes(submission.id) ? (
                    <><Star className="w-3 h-3 mr-1" />Pick</>
                  ) : (
                    <Star className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.userName}`} />
                  <AvatarFallback>{submission.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{submission.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(submission.submittedAt), 'MMM d')}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {submission.postCaption}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-3">
                  <span>{submission.likes} likes</span>
                  <span>{submission.comments} comments</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Score: {submission.likes + submission.comments * 2}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Winners Summary */}
      {(winners.length > 0 || curatorsPicks.length > 0) && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Selection Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Winners ({winners.length})</h5>
                <div className="space-y-2">
                  {winners.map((winnerId, index) => {
                    const submission = submissions.find(s => s.id === winnerId);
                    if (!submission) return null;
                    
                    const medals = ['🥇', '🥈', '🥉'];
                    const points = [300, 200, 100];
                    
                    return (
                      <div key={winnerId} className="flex items-center gap-3 p-2 bg-background rounded">
                        <span className="text-lg">{medals[index] || '🏆'}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{submission.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {points[index] || 50} points • {index === 0 ? 'Gold' : index === 1 ? 'Silver' : index === 2 ? 'Bronze' : 'Participant'} Medal
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Curator's Picks ({curatorsPicks.length})</h5>
                <div className="space-y-2">
                  {curatorsPicks.map((pickId) => {
                    const submission = submissions.find(s => s.id === pickId);
                    if (!submission) return null;
                    
                    return (
                      <div key={pickId} className="flex items-center gap-3 p-2 bg-background rounded">
                        <Star className="w-4 h-4 text-primary fill-current" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{submission.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            Special recognition • 75 points
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Finalize Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onFinalize}
          disabled={winners.length === 0}
          className="bg-gradient-to-r from-primary to-accent"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Finalize Results & Award Badges
        </Button>
      </div>
    </div>
  );
}