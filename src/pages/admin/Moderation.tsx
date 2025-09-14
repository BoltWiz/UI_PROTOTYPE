import { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, CheckCircle, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getModerationItems, moderateContent } from '@/lib/admin';
import { ModerationItem } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';

export default function AdminModeration() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = getModerationItems(activeTab === 'all' ? undefined : activeTab);
      setItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load moderation items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (itemId: string, action: 'approve' | 'remove', reason?: string) => {
    try {
      await moderateContent(itemId, action, reason);
      toast({
        title: "Success",
        description: `Content ${action}d successfully`
      });
      loadItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to moderate content",
        variant: "destructive"
      });
    }
  };

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case 'pending': return 'secondary';
      case 'flagged': return 'destructive';
      case 'approved': return 'default';
      case 'removed': return 'outline';
      default: return 'outline';
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    return item.state === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="text-muted-foreground mt-1">
          Review and moderate user-generated content
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="removed">Removed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3 mb-3" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-muted rounded flex-1" />
                      <div className="h-8 bg-muted rounded flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Content to Review</h3>
              <p className="text-muted-foreground">
                All content in this category has been reviewed.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {/* Content Preview */}
                  <div className="aspect-square bg-muted relative">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt="Content" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No preview available
                      </div>
                    )}
                    
                    {/* Flags overlay */}
                    {item.reasonFlags.length > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="gap-1">
                          <Flag className="w-3 h-3" />
                          {item.reasonFlags.length}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Content Info */}
                      <div>
                        <p className="text-sm font-medium line-clamp-2">
                          {item.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          By {item.authorName} • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Status and Flags */}
                      <div className="flex items-center justify-between">
                        <Badge variant={getStateBadgeVariant(item.state)}>
                          {item.state}
                        </Badge>
                        {item.reasonFlags.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Flags: {item.reasonFlags.join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => handleModerate(item.id, 'approve', 'Content approved by admin')}
                          disabled={item.state === 'approved'}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleModerate(item.id, 'remove', 'Content removed for policy violation')}
                          disabled={item.state === 'removed'}
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Remove
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // Handle view details
                            toast({
                              title: "View Details",
                              description: "Content detail view not implemented yet"
                            });
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}