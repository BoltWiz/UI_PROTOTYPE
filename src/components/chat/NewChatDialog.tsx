import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useConversations } from '@/hooks/useConversations';
import { UserMini } from '@/types/chat';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

// Mock users/stylists data
const availableUsers: UserMini[] = [
  {
    id: 'u4',
    name: 'Alex Kim',
    avatarUrl: '',
    role: 'user',
    isOnline: true
  },
  {
    id: 'u5',
    name: 'Maria Garcia',
    avatarUrl: '',
    role: 'user',
    isOnline: false,
    lastSeen: '2024-02-18T09:30:00Z'
  },
  {
    id: 's2',
    name: 'David Style',
    avatarUrl: '',
    role: 'stylist',
    isOnline: true
  },
  {
    id: 's3',
    name: 'Sophie Fashion',
    avatarUrl: '',
    role: 'stylist',
    isOnline: false,
    lastSeen: '2024-02-18T08:45:00Z'
  }
];

export function NewChatDialog({ open, onOpenChange, onConversationCreated }: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { createConversation } = useConversations();

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = async (user: UserMini) => {
    try {
      setLoading(true);
      const conversation = await createConversation(user.id);
      onConversationCreated(conversation.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users or stylists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                {searchQuery ? 'No users found' : 'No users available'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{user.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.isOnline 
                        ? 'Online' 
                        : user.lastSeen 
                          ? `Last seen ${new Date(user.lastSeen).toLocaleDateString()}`
                          : 'Offline'
                      }
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleStartChat(user)}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}