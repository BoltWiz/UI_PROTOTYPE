import { useState, useEffect } from 'react';
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
  Globe,
  Lock,
  FileText,
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data
const collections = [
  {
    id: 'c1',
    title: 'Corporate Chic',
    description: 'Professional outfits that command respect while maintaining elegance',
    coverUrl: '/mock/outfit1.jpg',
    visibility: 'public' as const,
    outfitsCount: 8,
    stats: { views: 1240, likes: 156, comments: 23 },
    tags: ['professional', 'elegant', 'timeless'],
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'c2',
    title: 'Weekend Warrior',
    description: 'Comfortable yet stylish looks for casual weekends',
    coverUrl: '/mock/outfit2.jpg',
    visibility: 'public' as const,
    outfitsCount: 6,
    stats: { views: 890, likes: 89, comments: 14 },
    tags: ['casual', 'comfort', 'weekend'],
    updatedAt: '2024-02-05T16:45:00Z'
  },
  {
    id: 'c3',
    title: 'Date Night Elegance',
    description: 'Romantic and sophisticated looks for special evenings',
    coverUrl: '/mock/beige-coat.jpg',
    visibility: 'draft' as const,
    outfitsCount: 4,
    stats: { views: 0, likes: 0, comments: 0 },
    tags: ['romantic', 'elegant', 'evening'],
    updatedAt: '2024-02-10T14:20:00Z'
  }
];

export default function StylistCollections() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4 text-green-600" />;
      case 'private': return <Lock className="h-4 w-4 text-blue-600" />;
      case 'draft': return <FileText className="h-4 w-4 text-orange-600" />;
      default: return null;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground">Create and manage your outfit collections</p>
        </div>
        <Button onClick={() => navigate('/stylist/collections/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <img 
                src={collection.coverUrl} 
                alt={collection.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3">
                <Badge className={getVisibilityColor(collection.visibility)}>
                  <div className="flex items-center gap-1">
                    {getVisibilityIcon(collection.visibility)}
                    {collection.visibility}
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
                    <DropdownMenuItem onClick={() => navigate(`/stylist/collections/${collection.id}/edit`)}>
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
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{collection.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {collection.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {collection.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{collection.outfitsCount} outfits</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {collection.stats.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {collection.stats.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {collection.stats.comments}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No collections found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first collection to get started'}
          </p>
          <Button onClick={() => navigate('/stylist/collections/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
      )}
    </div>
  );
}