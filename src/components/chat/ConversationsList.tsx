import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationItem } from './ConversationItem';
import { useConversations } from '@/hooks/useConversations';
import { MessageFilter } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ConversationsListProps {
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onNewChat: () => void;
}

export function ConversationsList({ 
  selectedConversationId, 
  onConversationSelect, 
  onNewChat 
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<MessageFilter>('all');
  const { conversations, loading } = useConversations(searchQuery, filter);

  const unreadCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount ?? 0), 0);
  const starredCount = conversations.filter(conv => conv.starred).length;

  if (loading) {
    return (
      <div className="w-80 border-r border-border bg-background">
        <div className="p-4 border-b border-border">
          <div className="h-10 bg-muted rounded animate-pulse mb-4" />
          <div className="h-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button size="sm" onClick={onNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-border">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as MessageFilter)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs flex items-center gap-1">
              Unread
              {unreadCount > 0 && (
                <Badge variant="default" className="h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="starred" className="text-xs flex items-center gap-1">
              Starred
              {starredCount > 0 && (
                <Badge variant="secondary" className="h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
                  {starredCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <div className="text-muted-foreground mb-2">
              {searchQuery || filter !== 'all' ? 'No conversations found' : 'No conversations yet'}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start a conversation with a stylist'
              }
            </p>
            {(!searchQuery && filter === 'all') && (
              <Button variant="outline" size="sm" onClick={onNewChat}>
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            )}
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={selectedConversationId === conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}