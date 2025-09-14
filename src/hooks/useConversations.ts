import { useState, useEffect } from 'react';
import { Conversation, MessageFilter } from '@/types/chat';
import conversationsData from '@/data/conversations.json';

export function useConversations(searchQuery?: string, filter: MessageFilter = 'all') {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadConversations = async () => {
      try {
        setLoading(true);
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filteredConversations = conversationsData as Conversation[];
        
        // Apply search filter
        if (searchQuery) {
          filteredConversations = filteredConversations.filter(conv =>
            conv.participants.some(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) || 
            (conv.lastMessage && conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }

        // Apply message filter
        switch (filter) {
          case 'unread':
            filteredConversations = filteredConversations.filter(conv => 
              (conv.unreadCount ?? 0) > 0
            );
            break;
          case 'starred':
            filteredConversations = filteredConversations.filter(conv => 
              conv.starred === true
            );
            break;
          // 'all' case - no additional filtering
        }

        // Sort by most recent
        filteredConversations.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        setConversations(filteredConversations);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [searchQuery, filter]);

  const createConversation = async (stylistId: string): Promise<Conversation> => {
    // Import the function from chat lib
    const { getOrCreateConversation } = await import('@/lib/chat');
    const newConversation = await getOrCreateConversation(stylistId);
    
    // Update local state
    setConversations(prev => {
      const existing = prev.find(conv => conv.id === newConversation.id);
      if (existing) {
        return prev;
      }
      return [newConversation, ...prev];
    });
    
    return newConversation;
  };

  return {
    conversations,
    loading,
    error,
    createConversation
  };
}