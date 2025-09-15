import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, Eye, Heart, MessageCircle, Instagram, Globe, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import collectionsData from '@/data/collections.sample.json';
import stylistGuidesData from '@/data/style-guides.json';

// Mock stylist data
const stylistProfiles = {
  'sarah-kim': {
    id: 's1',
    name: 'Sarah Kim',
    bio: 'Professional stylist with 8+ years experience in corporate and casual fashion. Specializing in minimalist aesthetics and sustainable fashion choices.',
    avatar: '',
    isVerified: true,
    followers: 2500,
    following: 180,
    totalLikes: 12400,
    specialties: ['Corporate', 'Minimalist', 'Sustainable'],
    socialLinks: {
      instagram: '@sarahkim_style',
      website: 'sarahkimstyle.com',
      portfolio: 'behance.net/sarahkim'
    },
    stats: {
      collections: 12,
      styleGuides: 8,
      consultations: 156
    }
  },
  'mike-chen': {
    id: 's2',
    name: 'Mike Chen',
    bio: 'Fashion consultant focused on casual and streetwear. Helping people express their personality through comfortable yet stylish clothing.',
    avatar: '',
    isVerified: true,
    followers: 1800,
    following: 220,
    totalLikes: 8900,
    specialties: ['Casual', 'Streetwear', 'Menswear'],
    socialLinks: {
      instagram: '@mikechen_fashion',
      website: 'mikechenstyle.com'
    },
    stats: {
      collections: 8,
      styleGuides: 12,
      consultations: 89
    }
  },
  'emma-davis': {
    id: 's3',
    name: 'Emma Davis',
    bio: 'Luxury fashion stylist specializing in evening wear and formal occasions. Creating elegant looks for special moments.',
    avatar: '',
    isVerified: true,
    followers: 3200,
    following: 95,
    totalLikes: 18600,
    specialties: ['Formal', 'Evening', 'Luxury'],
    socialLinks: {
      instagram: '@emmadavis_couture',
      website: 'emmadavisstyle.com',
      portfolio: 'emmadavis.style'
    },
    stats: {
      collections: 15,
      styleGuides: 6,
      consultations: 234
    }
  }
};

export default function StylistProfile() {
  const { stylistId } = useParams<{ stylistId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('collections');

  const stylist = stylistProfiles[stylistId as keyof typeof stylistProfiles];

  const stylistCollections = collectionsData.filter(
    collection => collection.stylistName === stylist?.name
  );

  const stylistGuides = stylistGuidesData.filter(
    guide => guide.stylistId === stylist?.id
  );

  useEffect(() => {
    if (!stylist) {
      navigate('/collections');
      return;
    }
    
    document.title = `${stylist.name} - Stylist Profile`;
  }, [stylist, navigate]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You are ${isFollowing ? 'no longer following' : 'now following'} ${stylist?.name}`
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message Stylist",
      description: `Opening chat with ${stylist?.name}...`
    });
  };

  const handleConsultation = () => {
    toast({
      title: "Book Consultation",
      description: `Booking consultation with ${stylist?.name}...`
    });
  };

  if (!stylist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stylist not found</h1>
          <Button onClick={() => navigate('/collections')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/collections')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collections
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="text-center md:text-left">
                <Avatar className="w-32 h-32 mx-auto md:mx-0 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stylist.name}`} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent text-white">
                    {stylist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{stylist.name}</h1>
                  {stylist.isVerified && (
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  )}
                </div>
                
                <Badge variant="secondary" className="mb-4">
                  Professional Stylist
                </Badge>
              </div>

              {/* Stats and Actions */}
              <div className="flex-1 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stylist.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stylist.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stylist.totalLikes.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Likes</div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground leading-relaxed">{stylist.bio}</p>

                {/* Specialties */}
                <div>
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {stylist.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {stylist.socialLinks.instagram && (
                    <Button variant="outline" size="sm">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  )}
                  {stylist.socialLinks.website && (
                    <Button variant="outline" size="sm">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </Button>
                  )}
                  {stylist.socialLinks.portfolio && (
                    <Button variant="outline" size="sm">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Portfolio
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    className={isFollowing ? "" : "bg-gradient-to-r from-primary to-accent"}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" onClick={handleMessage}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button onClick={handleConsultation}>
                    Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="guides">Style Guides</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stylistCollections.map((collection) => (
                <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={collection.cover} 
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{collection.title}</h3>
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/collections/${collection.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Style Guides Tab */}
          <TabsContent value="guides" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stylistGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={guide.coverImage} 
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{guide.category}</Badge>
                      <Badge variant="outline">{guide.difficulty}</Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{guide.title}</h3>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{guide.readTime} min read</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {guide.likes}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {guide.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Professional Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">{stylist.stats.collections}</div>
                      <div className="text-xs text-muted-foreground">Collections</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">{stylist.stats.styleGuides}</div>
                      <div className="text-xs text-muted-foreground">Style Guides</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">{stylist.stats.consultations}</div>
                      <div className="text-xs text-muted-foreground">Consultations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button onClick={handleMessage} className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button onClick={handleConsultation} variant="outline" className="w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Book Consultation
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Connect</h4>
                    <div className="space-y-2">
                      {stylist.socialLinks.instagram && (
                        <div className="flex items-center gap-2 text-sm">
                          <Instagram className="w-4 h-4 text-pink-500" />
                          <span>{stylist.socialLinks.instagram}</span>
                        </div>
                      )}
                      {stylist.socialLinks.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span>{stylist.socialLinks.website}</span>
                        </div>
                      )}
                      {stylist.socialLinks.portfolio && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-purple-500" />
                          <span>{stylist.socialLinks.portfolio}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}