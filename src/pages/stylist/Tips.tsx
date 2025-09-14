import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Eye, 
  Heart, 
  MessageCircle, 
  Edit, 
  MoreHorizontal,
  PenTool,
  Clock,
  Globe,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

// Mock data
const tips = [
  {
    id: 't1',
    title: 'The Art of Layering: Autumn Edition',
    coverUrl: '/mock/beige-coat.jpg',
    category: 'basics',
    difficulty: 'intermediate',
    readTime: 5,
    status: 'published' as const,
    stats: { views: 1240, likes: 234, comments: 45 },
    tags: ['layering', 'autumn', 'basics', 'texture'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z'
  },
  {
    id: 't2',
    title: 'Color Psychology in Fashion',
    coverUrl: '/mock/navy-polo.jpg',
    category: 'color',
    difficulty: 'beginner',
    readTime: 7,
    status: 'published' as const,
    stats: { views: 890, likes: 412, comments: 67 },
    tags: ['color', 'psychology', 'professional', 'seasonal'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-03T14:20:00Z'
  },
  {
    id: 't3',
    title: 'Building a Capsule Wardrobe',
    coverUrl: '/mock/white-tee.jpg',
    category: 'basics',
    difficulty: 'intermediate',
    readTime: 12,
    status: 'draft' as const,
    stats: { views: 0, likes: 0, comments: 0 },
    tags: ['capsule', 'minimalist', 'essentials'],
    createdAt: '2024-02-15T15:30:00Z',
    updatedAt: '2024-02-15T15:30:00Z'
  }
];

const categoryColors = {
  trend: 'bg-purple-100 text-purple-800',
  basics: 'bg-blue-100 text-blue-800',
  occasion: 'bg-green-100 text-green-800',
  color: 'bg-red-100 text-red-800',
  'body-type': 'bg-yellow-100 text-yellow-800'
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-orange-100 text-orange-800'
};

export default function StylistTips() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTips = tips.filter(tip =>
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tips Studio</h1>
          <p className="text-muted-foreground">Create and manage your style tips and articles</p>
        </div>
        <Button onClick={() => navigate('/stylist/tips/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Write New Tip
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip) => (
          <Card key={tip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <img 
                src={tip.coverUrl} 
                alt={tip.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={statusColors[tip.status]}>
                  {tip.status === 'published' ? (
                    <><Globe className="h-3 w-3 mr-1" />Published</>
                  ) : (
                    <><FileText className="h-3 w-3 mr-1" />Draft</>
                  )}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate(`/stylist/tips/${tip.id}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColors[tip.category as keyof typeof categoryColors]}>
                  {tip.category}
                </Badge>
                <Badge className={difficultyColors[tip.difficulty]}>
                  {tip.difficulty}
                </Badge>
              </div>
              
              <h3 className="font-semibold mb-2">{tip.title}</h3>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {tip.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tip.readTime} min read
                </div>
                {tip.status === 'published' && (
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {tip.stats.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {tip.stats.likes}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(tip.updatedAt), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tips found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Write your first style tip to get started'}
          </p>
          <Button onClick={() => navigate('/stylist/tips/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Write New Tip
          </Button>
        </div>
      )}
    </div>
  );
}