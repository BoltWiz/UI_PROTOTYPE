import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Flag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types';
import { getCommunityPosts, saveCommunityPosts, getCurrentUser } from '@/lib/mock';
import { formatDistanceToNow } from 'date-fns';

export default function Moderation() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Only allow admin users
    if (currentUser.role !== 'admin') {
      return;
    }
    loadPosts();
  }, [currentUser]);

  const loadPosts = () => {
    const allPosts = getCommunityPosts();
    setPosts(allPosts);
    
    const postsWithReports = allPosts.filter(post => 
      post.reports && post.reports.length > 0
    );
    setReportedPosts(postsWithReports);
  };

  const handleModeratePost = (postId: string, action: 'hide' | 'approve', note?: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          status: action === 'hide' ? 'hidden' : 'visible',
          moderationNote: note || '',
          moderatedBy: currentUser.id,
          moderatedAt: new Date().toISOString()
        } as Post;
      }
      return post;
    });

    setPosts(updatedPosts);
    saveCommunityPosts(updatedPosts);
    
    // Update reported posts list
    setReportedPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: action === 'hide' ? 'hidden' : 'visible' }
        : post
    ));

    setSelectedPost(null);
    setModerationNote('');

    toast({
      title: `Post ${action === 'hide' ? 'hidden' : 'approved'}`,
      description: `The post has been ${action === 'hide' ? 'hidden from' : 'approved for'} the community`
    });
  };

  const handleDismissReports = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          reports: [] // Clear all reports
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    saveCommunityPosts(updatedPosts);
    
    setReportedPosts(prev => prev.filter(post => post.id !== postId));

    toast({
      title: "Reports dismissed",
      description: "All reports for this post have been dismissed"
    });
  };

  // Redirect if not admin
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </Card>
      </div>
    );
  }

  const totalPosts = posts.length;
  const visiblePosts = posts.filter(post => post.status === 'visible').length;
  const hiddenPosts = posts.filter(post => post.status === 'hidden').length;
  const totalReports = reportedPosts.reduce((sum, post) => sum + (post.reports?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-fashion-rose bg-clip-text text-transparent">
            Content Moderation
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage community content
          </p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Shield className="w-4 h-4" />
          Admin Panel
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-xl font-bold">{totalPosts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visible</p>
              <p className="text-xl font-bold">{visiblePosts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <EyeOff className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hidden</p>
              <p className="text-xl font-bold">{hiddenPosts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Flag className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reports</p>
              <p className="text-xl font-bold">{totalReports}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reported Posts Section */}
      {reportedPosts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">Posts Needing Review</h2>
            <Badge variant="destructive">{reportedPosts.length}</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reportedPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-yellow-200 dark:border-yellow-800">
                <div className="p-4">
                  {/* Post Preview */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.caption}</p>
                      <p className="text-xs text-muted-foreground">
                        Posted {post.timestamp ? formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) : 'recently'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant={post.status === 'hidden' ? 'destructive' : 'secondary'} className="text-xs">
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Reports */}
                  <Alert className="mb-3 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <strong>{post.reports?.length || 0} report(s):</strong>
                      <ul className="mt-1 text-sm">
                        {post.reports?.slice(0, 2).map((report, index) => (
                          <li key={index}>• {report.reason}</li>
                        ))}
                        {(post.reports?.length || 0) > 2 && (
                          <li>• +{(post.reports?.length || 0) - 2} more</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedPost(post)}
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hide
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <ModerationDialog
                          post={post}
                          action="hide"
                          onConfirm={(note) => handleModeratePost(post.id, 'hide', note)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleModeratePost(post.id, 'approve')}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDismissReports(post.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
          <p className="text-muted-foreground">
            No posts currently need moderation review.
          </p>
        </Card>
      )}

      {/* All Posts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Posts</h2>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium mb-2 truncate">{post.caption}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={post.status === 'hidden' ? 'destructive' : 'secondary'} className="text-xs">
                      {post.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flag className="w-3 h-3" />
                      {post.reports?.length || 0}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No posts found</p>
          </Card>
        )}
      </div>
    </div>
  );
}

// Moderation Dialog Component
interface ModerationDialogProps {
  post: Post;
  action: 'hide' | 'approve';
  onConfirm: (note: string) => void;
}

function ModerationDialog({ post, action, onConfirm }: ModerationDialogProps) {
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    onConfirm(note);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {action === 'hide' ? 'Hide Post' : 'Approve Post'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            You are about to {action} this post. This action will affect its visibility in the community feed.
          </AlertDescription>
        </Alert>

        <div>
          <label className="text-sm font-medium mb-2 block">Moderation Note (Optional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about why this action was taken..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            variant={action === 'hide' ? 'destructive' : 'default'}
            className="flex-1"
          >
            {action === 'hide' ? 'Hide Post' : 'Approve Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}