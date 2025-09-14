import { useState, useEffect } from 'react';
import { TrendingUp, Star, Eye, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStyleGuides, getStylistCollections, getCurrentUser } from '@/lib/mock';
import { formatDistanceToNow } from 'date-fns';

export default function CommunityTrends() {
  const [styleGuides, setStyleGuides] = useState([]);
  const [collections, setCollections] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Prioritize stylist content
    const guides = getStyleGuides().filter(g => g.isPublic);
    const cols = getStylistCollections().filter(c => c.isPublic);
    setStyleGuides(guides);
    setCollections(cols);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Trending Style Content</h1>
      </div>

      {/* Featured Style Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {styleGuides.map((guide) => (
          <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted">
              <img src={guide.coverImage} alt={guide.title} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Style Guide</Badge>
                <Badge variant="outline">{guide.difficulty}</Badge>
              </div>
              <h3 className="font-semibold mb-2">{guide.title}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{guide.readTime} min read</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {guide.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Stylist
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted">
              <img src={collection.coverImage} alt={collection.title} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>Collection</Badge>
                <Badge variant="outline">{collection.season}</Badge>
              </div>
              <h3 className="font-semibold mb-2">{collection.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{collection.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{collection.tags.slice(0,2).join(', ')}</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {collection.likes}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}