import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Eye, 
  Heart, 
  MessageCircle, 
  Edit, 
  MoreHorizontal,
  Globe,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

// Mock data - posts published to community
const publishedPosts = [
  {
    id: 'p1',
    type: 'collection',
    title: 'Corporate Chic Collection',
    coverUrl: '/mock/outfit1.jpg',
    status: 'approved' as const,
    stats: { views: 1240, likes: 156, comments: 23, shares: 12 },
    publishedAt: '2024-02-15T10:30:00Z',
    moderationNotes: ''
  },
  {
    id: 'p2',
    type: 'tip',
    title: 'The Art of Layering: Autumn Edition',
    coverUrl: '/mock/beige-coat.jpg',
    status: 'approved' as const,
    stats: { views: 890, likes: 234, comments: 45, shares: 28 },
    publishedAt: '2024-02-10T14:20:00Z',
    moderationNotes: ''
  },
  {
    id: 'p3',
    type: 'collection',
    title: 'Date Night Elegance',
    coverUrl: '/mock/outfit2.jpg',
    status: 'flagged' as const,
    stats: { views: 520, likes: 89, comments: 12, shares: 4 },
    publishedAt: '2024-02-12T16:45:00Z',
    moderationNotes: 'Reported for inappropriate content - under review'
  }
];

const statusColors = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  flagged: 'bg-red-100 text-red-800',
  rejected: 'bg-gray-100 text-gray-800'
};

const typeColors = {
  collection: 'bg-blue-100 text-blue-800',
  tip: 'bg-purple-100 text-purple-800',
  post: 'bg-green-100 text-green-800'
};

export default function StylistPosts() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = publishedPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Globe className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Posts</h1>
          <p className="text-muted-foreground">Manage your published content in the community</p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{publishedPosts.filter(p => p.status === 'approved').length} Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{publishedPosts.filter(p => p.status === 'flagged').length} Flagged</span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <img 
                src={post.coverUrl} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={typeColors[post.type as keyof typeof typeColors]}>
                  {post.type}
                </Badge>
                <Badge className={statusColors[post.status]}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(post.status)}
                    {post.status}
                  </div>
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
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View in Community
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Original
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Unpublish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{post.title}</h3>
              
              {post.status === 'flagged' && post.moderationNotes && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-3">
                  <p className="text-xs text-red-700">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {post.moderationNotes}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.stats.views} views
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {post.stats.likes} likes
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {post.stats.comments} comments
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {post.stats.shares} shares
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Published {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No published content found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search terms' : 'Your published collections and tips will appear here'}
          </p>
        </div>
      )}
    </div>
  );
}