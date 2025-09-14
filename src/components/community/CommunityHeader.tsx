import { Plus, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CommunityHeaderProps {
  postsCount: number;
  onNewPost: () => void;
}

export function CommunityHeader({ postsCount, onNewPost }: CommunityHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Style Community
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your looks, discover new styles, and connect with fashion lovers
          </p>
        </div>
        
        <Button 
          onClick={onNewPost}
          className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Share Look
        </Button>
      </div>

      {/* Community Stats */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-0 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                Fashion Community
              </h3>
              <p className="text-muted-foreground">
                {postsCount} inspiring looks shared • Growing community
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <Badge variant="outline" className="border-primary/20 text-primary">
              Trending
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}