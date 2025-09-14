import { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit3, Trash2, Heart, Eye, BookOpen, MessageCircle, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/mock';
import { 
  getStylistCollections, 
  addStylistCollection, 
  updateStylistCollection, 
  deleteStylistCollection,
  getStyleGuides,
  addStyleGuide,
  updateStyleGuide,
  deleteStyleGuide,
  getConsultations,
  answerConsultation
} from '@/lib/mock';
import { formatDistanceToNow } from 'date-fns';
import { OutfitCollection, StyleGuide, Consultation } from '@/types';

export default function StylistDashboard() {
  const [collections, setCollections] = useState<OutfitCollection[]>([]);
  const [styleGuides, setStyleGuides] = useState<StyleGuide[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCollections(getStylistCollections(currentUser.id));
    setStyleGuides(getStyleGuides(currentUser.id));
    setConsultations(getConsultations(undefined, currentUser.id));
  };

  const handleCreateCollection = (data: any) => {
    const newCollection = addStylistCollection({
      ...data,
      stylistId: currentUser.id
    });
    setCollections(prev => [newCollection, ...prev]);
    toast({
      title: "Collection Created",
      description: "Your new outfit collection has been created successfully"
    });
  };

  const handleCreateStyleGuide = (data: any) => {
    const newGuide = addStyleGuide({
      ...data,
      stylistId: currentUser.id
    });
    setStyleGuides(prev => [newGuide, ...prev]);
    toast({
      title: "Style Guide Created",
      description: "Your new style guide has been published successfully"
    });
  };

  const handleAnswerConsultation = (consultationId: string, answer: string) => {
    answerConsultation(consultationId, answer);
    loadData();
    toast({
      title: "Consultation Answered",
      description: "Your response has been sent to the client"
    });
  };

  const stats = {
    totalCollections: collections.length,
    totalGuides: styleGuides.length,
    totalLikes: collections.reduce((sum, c) => sum + c.likes, 0) + styleGuides.reduce((sum, g) => sum + g.likes, 0),
    pendingConsultations: consultations.filter(c => c.status === 'pending').length,
    followers: currentUser.followerCount || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-fashion-rose bg-clip-text text-transparent">
            Stylist Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your collections, guides, and consultations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="w-4 h-4" />
            {currentUser.isVerifiedStylist ? 'Verified Stylist' : 'Stylist'}
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="guides">Style Guides</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Collections</p>
                    <p className="text-2xl font-bold">{stats.totalCollections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Edit3 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Style Guides</p>
                    <p className="text-2xl font-bold">{stats.totalGuides}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                    <p className="text-2xl font-bold">{stats.totalLikes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pendingConsultations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="text-2xl font-bold">{stats.followers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collections.slice(0, 3).map((collection) => (
                  <div key={collection.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">{collection.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge>{collection.likes} likes</Badge>
                  </div>
                ))}
                {styleGuides.slice(0, 2).map((guide) => (
                  <div key={guide.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Edit3 className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">{guide.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(guide.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge>{guide.likes} likes</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collections */}
        <TabsContent value="collections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Outfit Collections</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <CollectionForm onSubmit={handleCreateCollection} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img src={collection.coverImage} alt={collection.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold truncate">{collection.title}</h3>
                    <Badge variant={collection.isPublic ? 'default' : 'secondary'}>
                      {collection.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      {collection.likes}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Style Guides */}
        <TabsContent value="guides" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Style Guides</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <StyleGuideForm onSubmit={handleCreateStyleGuide} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleGuides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img src={guide.coverImage} alt={guide.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold truncate">{guide.title}</h3>
                    <Badge variant="outline">{guide.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <span>{guide.readTime} min read</span>
                    <Badge variant="secondary" className="text-xs">{guide.difficulty}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      {guide.likes}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Consultations */}
        <TabsContent value="consultations" className="space-y-4">
          <h2 className="text-2xl font-semibold">Client Consultations</h2>
          
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{consultation.category}</Badge>
                        <Badge variant={consultation.status === 'pending' ? 'destructive' : 'secondary'}>
                          {consultation.status}
                        </Badge>
                      </div>
                      <p className="font-medium mb-2">Question:</p>
                      <p className="text-sm text-muted-foreground mb-3">{consultation.question}</p>
                      
                      {consultation.answer && (
                        <>
                          <p className="font-medium mb-2">Your Answer:</p>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">{consultation.answer}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Asked {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
                    </p>
                    {consultation.status === 'pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Answer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <ConsultationAnswerForm 
                            consultation={consultation}
                            onSubmit={(answer) => handleAnswerConsultation(consultation.id, answer)}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stylist Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-fashion-rose to-accent rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                  <p className="text-muted-foreground">{currentUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {currentUser.specialties?.map((specialty) => (
                      <Badge key={specialty} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Bio</Label>
                <Textarea value={currentUser.bio || ''} className="mt-1" readOnly />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Followers</Label>
                  <Input value={currentUser.followerCount || 0} readOnly />
                </div>
                <div>
                  <Label>Verification Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Switch checked={currentUser.isVerifiedStylist || false} disabled />
                    <span className="text-sm text-muted-foreground">
                      {currentUser.isVerifiedStylist ? 'Verified Stylist' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Collection Form Component
function CollectionForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '/mock/outfit1.jpg',
    tags: '',
    season: 'autumn',
    occasions: '',
    isPublic: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      itemIds: [], // Would be populated when adding items
      tags: formData.tags.split(',').map(t => t.trim()),
      occasions: formData.occasions.split(',').map(o => o.trim()),
      trends: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Create New Collection</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="professional, elegant, timeless"
          />
        </div>
        
        <div>
          <Label htmlFor="season">Season</Label>
          <Select value={formData.season} onValueChange={(value) => setFormData({...formData, season: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="autumn">Autumn</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="occasions">Occasions (comma separated)</Label>
          <Input
            id="occasions"
            value={formData.occasions}
            onChange={(e) => setFormData({...formData, occasions: e.target.value})}
            placeholder="work, meetings, presentations"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData({...formData, isPublic: checked})}
          />
          <Label>Make public</Label>
        </div>
        
        <Button type="submit" className="w-full">Create Collection</Button>
      </div>
    </form>
  );
}

// Style Guide Form Component
function StyleGuideForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '/mock/beige-coat.jpg',
    tags: '',
    category: 'basics',
    difficulty: 'beginner',
    readTime: 5,
    isPublic: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()),
      images: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Create New Style Guide</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="min-h-[200px]"
            placeholder="# Style Guide Title&#10;&#10;Write your style guide content in Markdown format..."
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basics">Basics</SelectItem>
                <SelectItem value="trend">Trend</SelectItem>
                <SelectItem value="occasion">Occasion</SelectItem>
                <SelectItem value="color">Color</SelectItem>
                <SelectItem value="body-type">Body Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="readTime">Read Time (minutes)</Label>
          <Input
            id="readTime"
            type="number"
            value={formData.readTime}
            onChange={(e) => setFormData({...formData, readTime: parseInt(e.target.value)})}
            min="1"
            max="60"
          />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="layering, autumn, basics, texture"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData({...formData, isPublic: checked})}
          />
          <Label>Publish publicly</Label>
        </div>
        
        <Button type="submit" className="w-full">Create Style Guide</Button>
      </div>
    </form>
  );
}

// Consultation Answer Form Component
function ConsultationAnswerForm({ consultation, onSubmit }: { consultation: Consultation; onSubmit: (answer: string) => void }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Answer Consultation</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-medium mb-2">Question:</p>
          <p className="text-sm">{consultation.question}</p>
        </div>
        
        <div>
          <Label htmlFor="answer">Your Answer</Label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[120px]"
            placeholder="Provide your styling advice..."
            required
          />
        </div>
        
        <Button type="submit" className="w-full">Send Answer</Button>
      </div>
    </form>
  );
}