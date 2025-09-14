import { useState } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ConversationsList } from './ConversationsList';
import { ThreadView } from './ThreadView';
import { useConversations } from '@/hooks/useConversations';
import { useIsMobile } from '@/hooks/use-mobile';

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InboxDrawer({ isOpen, onClose }: InboxDrawerProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const { conversations } = useConversations();
  const isMobile = useIsMobile();

  const selectedConversation = selectedConversationId 
    ? conversations.find(conv => conv.id === selectedConversationId)
    : null;

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleNewChat = () => {
    // TODO: Implement new chat functionality
    console.log('New chat');
  };

  const handleBack = () => {
    setSelectedConversationId(undefined);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-4xl p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle>Messages</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 flex min-h-0">
          {/* Mobile: Stack views, Desktop: Side by side */}
          {isMobile ? (
            <>
              {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                  <ThreadView
                    conversation={selectedConversation}
                    currentUserId="u1" // TODO: Get from auth context
                    onBack={handleBack}
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <ConversationsList
                    selectedConversationId={selectedConversationId}
                    onConversationSelect={handleConversationSelect}
                    onNewChat={handleNewChat}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Desktop: Side by side layout */}
              <div className="w-80 border-r border-border flex-shrink-0">
                <ConversationsList
                  selectedConversationId={selectedConversationId}
                  onConversationSelect={handleConversationSelect}
                  onNewChat={handleNewChat}
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <ThreadView
                    conversation={selectedConversation}
                    currentUserId="u1" // TODO: Get from auth context
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Select a conversation</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}