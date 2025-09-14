import { Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">No Favorite Outfits Yet</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Start building your favorite outfits collection! Save outfits you love from your wardrobe or create new ones.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate('/wardrobe')}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse Wardrobe
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/suggest')}
          >
            Get Suggestions
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Create outfits and mark them as favorites to see personalized style insights and recommendations.
          </p>
        </div>
      </Card>
    </div>
  );
}