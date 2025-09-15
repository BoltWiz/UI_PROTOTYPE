import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Heart, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import collectionsData from '@/data/collections.sample.json';
import { useNavigate } from 'react-router-dom';

export default function Collections() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [collections] = useState(collectionsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [occasionFilter, setOccasionFilter] = useState('all');

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSeason = seasonFilter === 'all' || collection.season === seasonFilter;
    const matchesOccasion = occasionFilter === 'all' || collection.occasion === occasionFilter;
    
    return matchesSearch && matchesSeason && matchesOccasion;
  });

  const handleGuestAction = (action: string) => {
    toast({
      title: "Đăng ký để sử dụng tính năng này",
      description: `Vui lòng đăng ký để có thể ${action} bộ sưu tập.`,
      variant: "default"
    });
  };

  const handleStylistClick = (stylistName: string) => {
    // Navigate to stylist profile - using name as ID for demo
    const stylistId = stylistName.toLowerCase().replace(' ', '-');
    navigate(`/stylist-profile/${stylistId}`);
  };

  const handleUseInOutfit = (collection: any) => {
    try {
      // Save collection outfit to localStorage for Daily page
      const collectionOutfit = {
        id: `collection_${collection.id}_${Date.now()}`,
        source: 'collection',
        collectionId: collection.id,
        collectionTitle: collection.title,
        stylistName: collection.stylistName,
        items: collection.itemsPreview,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem('collection_outfit', JSON.stringify(collectionOutfit));
      
      // Increment usage count
      const currentCount = localStorage.getItem(`collection_usage_${collection.id}`);
      const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
      localStorage.setItem(`collection_usage_${collection.id}`, newCount.toString());
      
      toast({
        title: "Outfit saved from collection",
        description: `"${collection.title}" has been added to your daily outfits`
      });
      
      navigate('/daily');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save outfit from collection",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    document.title = "Style Collections - Fashion Inspiration";
    
    // Add meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Discover curated fashion collections and style inspiration from professional stylists.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Bộ Sưu Tập Thời Trang</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá những bộ sưu tập được tuyển chọn bởi các stylist chuyên nghiệp
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bộ sưu tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={seasonFilter} onValueChange={setSeasonFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Mùa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mùa</SelectItem>
              <SelectItem value="spring-summer">Xuân - Hè</SelectItem>
              <SelectItem value="autumn-winter">Thu - Đông</SelectItem>
              <SelectItem value="all-season">Quanh năm</SelectItem>
            </SelectContent>
          </Select>

          <Select value={occasionFilter} onValueChange={setOccasionFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Dịp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả dịp</SelectItem>
              <SelectItem value="work">Công việc</SelectItem>
              <SelectItem value="casual">Thường ngày</SelectItem>
              <SelectItem value="formal">Trang trọng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <Link key={collection.id} to={`/collections/${collection.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={collection.cover} 
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">
                      {collection.season.replace('-', ' & ')}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{collection.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {collection.shortDescription}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {collection.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      bởi <span 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleStylistClick(collection.stylistName);
                        }}
                        className="text-primary hover:underline font-medium cursor-pointer"
                      >
                        {collection.stylistName}
                      </span>
                    </span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {collection.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {collection.likes}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy bộ sưu tập</h3>
            <p className="text-muted-foreground">
              Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Guest Action Buttons for Demo */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleGuestAction('lưu')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleUseInOutfit(collections[0])}
          >
            Sử dụng trong outfit
          </Button>
        </div>
      </div>
    </div>
  );
}