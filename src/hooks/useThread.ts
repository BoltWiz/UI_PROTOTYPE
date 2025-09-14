import { useState, useEffect, useCallback } from 'react';
import { Message, UserMini } from '@/types/chat';
import messagesData from '@/data/messages.json';

interface SendMessagePayload {
  type: 'text' | 'image';
  content: string;
}

export function useThread(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [typing, setTyping] = useState<{ [userId: string]: boolean }>({});

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const threadMessages = (messagesData as Message[])
          .filter(msg => msg.conversationId === conversationId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        setMessages(threadMessages);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      conversationId,
      sender: {
        id: 's1',
        name: 'Emma Style',
        role: 'stylist'
      } as UserMini,
      type: payload.type,
      content: payload.content,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    // Add temp message immediately
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, id: `msg_${Date.now()}`, status: 'sent' as const }
            : msg
        )
      );
    } catch (err) {
      // Update to failed status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, status: 'failed' as const }
            : msg
        )
      );
    }
  }, [conversationId]);

  const markRead = useCallback(async () => {
    // Mock mark as read
    console.log(`Marking conversation ${conversationId} as read`);
  }, [conversationId]);

  const startTyping = useCallback((userId: string) => {
    setTyping(prev => ({ ...prev, [userId]: true }));
    // Auto-stop typing after 3 seconds
    setTimeout(() => {
      setTyping(prev => ({ ...prev, [userId]: false }));
    }, 3000);
  }, []);

  return {
    messages,
    loading,
    error,
    typing,
    sendMessage,
    markRead,
    startTyping
  };
}