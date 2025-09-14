import { useState } from 'react';
import { Heart, MessageCircle, Flag, Send, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Post } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  currentUser: any;
  onLike: () => void;
  onComment: (text: string) => void;
  onSubmitComment: () => void;
  onReport: (reason: string) => void;
  commentText: string;
}

export function PostCard({ 
  post, 
  currentUser, 
  onLike, 
  onComment, 
  onSubmitComment, 
  onReport, 
  commentText 
}: PostCardProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center ring-2 ring-primary/20">
                <span className="text-lg font-bold text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground">{currentUser.name}</h4>
              <p className="text-xs text-muted-foreground">
                {post.timestamp ? formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) : 'Recently'}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                <Flag className="w-4 h-4 mr-2" />
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Why are you reporting this post?
                </p>
                <div className="grid gap-2">
                  {['Inappropriate content', 'Spam', 'Harassment', 'Other'].map(reason => (
                    <Button
                      key={reason}
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        onReport(reason);
                        setShowReportDialog(false);
                      }}
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Post Image */}
      <div className="px-6 pb-4">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-background shadow-inner max-w-sm mx-auto">
          <img
            src={post.image}
            alt="Outfit post"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-6 space-y-4">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLike} 
              className="gap-2 hover:text-red-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">{post.likes}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.comments.length}</span>
            </Button>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <p className="text-foreground leading-relaxed">{post.caption}</p>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="space-y-2">
              {post.comments.slice(0, 2).map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">{currentUser.name}</span>{' '}
                    <span className="text-sm text-muted-foreground">{comment.text}</span>
                  </div>
                </div>
              ))}
            </div>
            {post.comments.length > 2 && (
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* Add Comment */}
        <div className="flex gap-3 pt-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => onComment(e.target.value)}
              className="border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSubmitComment();
                }
              }}
            />
            <Button
              size="sm"
              onClick={onSubmitComment}
              disabled={!commentText.trim()}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}