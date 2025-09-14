import { useState } from 'react';
import { ConversationsList } from './ConversationsList';
import { ThreadView } from './ThreadView';
import { NewChatDialog } from './NewChatDialog';
import { useConversations } from '@/hooks/useConversations';
import { MessageCircle } from 'lucide-react';

interface InboxLayoutProps {
  currentUserId?: string;
}

export function InboxLayout({ currentUserId = 's1' }: InboxLayoutProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const { conversations } = useConversations();

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleNewChat = () => {
    setShowNewChatDialog(true);
  };

  const handleCloseNewChat = () => {
    setShowNewChatDialog(false);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Conversations List - Hide on mobile when thread is selected */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col`}>
        <ConversationsList
          selectedConversationId={selectedConversationId || undefined}
          onConversationSelect={handleConversationSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Thread View */}
      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedConversation ? (
          <ThreadView
            conversation={selectedConversation}
            currentUserId={currentUserId}
            onBack={handleBackToList}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageCircle className="h-24 w-24 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold mb-2">Welcome to Messages</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Select a conversation from the sidebar to start chatting, or create a new conversation with a stylist.
            </p>
          </div>
        )}
      </div>

      {/* New Chat Dialog */}
      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onConversationCreated={(conversationId) => {
          setSelectedConversationId(conversationId);
          setShowNewChatDialog(false);
        }}
      />
    </div>
  );
}