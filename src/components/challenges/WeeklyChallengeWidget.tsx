import { Trophy, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Challenge } from '@/types/challenges';

interface WeeklyChallengeWidgetProps {
  challenge?: Challenge;
}

export function WeeklyChallengeWidget({ challenge }: WeeklyChallengeWidgetProps) {
  if (!challenge) {
    return (
      <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Weekly Challenge</h3>
              <p className="text-muted-foreground">No active challenges</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Check back soon for new challenges!</p>
            <Button asChild variant="outline">
              <Link to="/challenges">View All Challenges</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">This Week's Challenge</h3>
              <p className="text-muted-foreground">Join the community challenge!</p>
            </div>
          </div>
          <Badge className="bg-primary/20 text-primary">Featured</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-1">{challenge.title}</h4>
            <p className="text-muted-foreground text-sm line-clamp-2">{challenge.brief}</p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>15 participants</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getDaysRemaining(challenge.endAt)} days left</span>
            </div>
          </div>
          
          <div className="flex gap-2">
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
          
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link to={`/challenges/${challenge.slug}`}>
              Join Challenge
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}