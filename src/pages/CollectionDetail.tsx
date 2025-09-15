import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Bookmark, Share2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import collectionsData from '@/data/collections.sample.json';

export default function CollectionDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [collection] = useState(() => 
    collectionsData.find(c => c.id === id)
  );

  const relatedCollections = collectionsData
    .filter(c => c.id !== id && c.tags.some(tag => collection?.tags.includes(tag)))
    .slice(0, 3);

  const handleGuestAction = (action: string) => {
    toast({
      title: "Đăng ký để sử dụng tính năng này",
      description: `Vui lòng đăng ký để có thể ${action} bộ sưu tập.`,
      variant: "default"
    });
  };

  useEffect(() => {
    if (collection) {
      document.title = `${collection.title} - Style Collection`;
      
      // Add meta tags for SEO
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', collection.description);
      }

      // Add Open Graph meta tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', collection.title);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', collection.description);

      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', collection.cover);
    }
  }, [collection]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy bộ sưu tập</h1>
          <Link to="/collections">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/collections">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src={collection.cover} 
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">{collection.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {collection.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {collection.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span>bởi <button 
                onClick={() => {
                  const stylistId = collection.stylistName.toLowerCase().replace(' ', '-');
                  window.location.href = `/stylist-profile/${stylistId}`;
                }}
                className="text-primary hover:underline font-medium"
              >
                {collection.stylistName}
              </button></span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {collection.views} lượt xem
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {collection.likes} lượt thích
              </span>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => handleGuestAction('lưu')}>
                <Bookmark className="w-4 h-4 mr-2" />
                Lưu bộ sưu tập
              </Button>
              <Button variant="outline" onClick={() => handleGuestAction('thích')}>
                <Heart className="w-4 h-4 mr-2" />
                Thích
              </Button>
              <Button variant="outline" onClick={() => {
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
                
                toast({
                  title: "Outfit saved from collection",
                  description: `"${collection.title}" has been added to your daily outfits`
                });
                
                window.location.href = '/daily';
              }}>
                <Share2 className="w-4 h-4 mr-2" />
                Sử dụng trong outfit
              </Button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Các item trong bộ sưu tập</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collection.itemsPreview.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  <img 
                    src={item.imageUrl} 
                    alt={`${item.type} item`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{item.type}</span>
                    <div className="flex gap-1">
                      {item.colors.map((color, colorIndex) => (
                        <div 
                          key={colorIndex}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color === 'white' ? '#ffffff' : color === 'navy' ? '#1e3a8a' : color === 'dark-blue' ? '#1e40af' : color === 'brown' ? '#92400e' : color === 'beige' ? '#d6d3d1' : color === 'black' ? '#000000' : color }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Collections */}
        {relatedCollections.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Bộ sưu tập liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCollections.map((relatedCollection) => (
                <Link key={relatedCollection.id} to={`/collections/${relatedCollection.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-muted">
                      <img 
                        src={relatedCollection.cover} 
                        alt={relatedCollection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{relatedCollection.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {relatedCollection.shortDescription}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>bởi <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const stylistId = relatedCollection.stylistName.toLowerCase().replace(' ', '-');
                            window.location.href = `/stylist-profile/${stylistId}`;
                          }}
                          className="text-primary hover:underline font-medium"
                        >
                          {relatedCollection.stylistName}
                        </button></span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {relatedCollection.likes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}