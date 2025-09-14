import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Trophy, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/types/challenges';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/src/data/challenges.json');
      const data = await response.json();
      setChallenges(data);
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

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) {
      return;
    }

    // Mock delete
    setChallenges(challenges.filter(c => c.id !== challengeId));
    
    toast({
      title: "Challenge deleted",
      description: "The challenge has been successfully deleted"
    });
  };

  const handleCloseChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to close this challenge and finalize results?')) {
      return;
    }

    // Mock close challenge
    setChallenges(challenges.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'ended' as const, endAt: new Date().toISOString() }
        : c
    ));
    
    toast({
      title: "Challenge closed",
      description: "The challenge has been closed and results are being finalized"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenge Management</h1>
          <p className="text-muted-foreground">Create and manage community challenges</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challenges.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {challenges.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Across all challenges</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,249</div>
            <p className="text-xs text-muted-foreground">All time entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Challenges Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Curator</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Entries</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => (
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
                        <div className="text-sm text-muted-foreground">
                          {challenge.hashtag}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(challenge.status)}</TableCell>
                  <TableCell>
                    {challenge.curatorId ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Emma Style
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(new Date(challenge.startAt), 'MMM d')}</div>
                      <div className="text-muted-foreground">
                        to {format(new Date(challenge.endAt), 'MMM d')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">15 entries</div>
                      <div className="text-muted-foreground">12 participants</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/challenges/${challenge.slug}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {challenge.status === 'active' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCloseChallenge(challenge.id)}
                        >
                          Close
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}