import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThreadView } from './ThreadView';
import { useConversations } from '@/hooks/useConversations';
import { Conversation, UserMini } from '@/types/chat';

interface QuickChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  stylist: UserMini;
  onOpenFullInbox?: () => void;
}

export function QuickChatModal({ isOpen, onClose, stylist, onOpenFullInbox }: QuickChatModalProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createConversation, conversations } = useConversations();

  useEffect(() => {
    if (isOpen && stylist.id) {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p.id === stylist.id)
      );
      
      if (existingConversation) {
        setConversation(existingConversation);
      } else {
        // Create new conversation
        handleCreateConversation();
      }
    }
  }, [isOpen, stylist.id, conversations]);

  const handleCreateConversation = async () => {
    if (!stylist.id || isLoading) return;
    
    setIsLoading(true);
    try {
      const newConversation = await createConversation(stylist.id);
      setConversation(newConversation);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConversation(null);
    onClose();
  };

  const handleOpenFullInbox = () => {
    onOpenFullInbox?.();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md h-[600px] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={stylist.avatarUrl} />
                <AvatarFallback>
                  {stylist.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{stylist.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    Stylist
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stylist.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Starting conversation...</p>
              </div>
            </div>
          ) : conversation ? (
            <ThreadView
              conversation={conversation}
              currentUserId="u1" // TODO: Get from auth context
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Avatar className="h-16 w-16 mb-4">
                <AvatarImage src={stylist.avatarUrl} />
                <AvatarFallback className="text-lg">
                  {stylist.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold mb-2">Start a conversation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Say hi to {stylist.name} and get personalized style advice!
              </p>
              <Button onClick={handleCreateConversation} disabled={isLoading}>
                Send message
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {conversation && (
          <div className="p-4 border-t border-border flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenFullInbox}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open full inbox
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}