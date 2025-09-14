import { Conversation, UserMini } from '@/types/chat';
import { getCurrentUser } from './mock';

// Mock function to get or create a conversation
export const getOrCreateConversation = async (stylistId: string): Promise<Conversation> => {
  const currentUser = getCurrentUser();
  
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check existing conversations in localStorage
  const existingConversations = getStoredConversations();
  const existing = existingConversations.find(conv => 
    conv.participants.some(p => p.id === stylistId && p.id !== currentUser.id)
  );
  
  if (existing) {
    return existing;
  }
  
  // Create new conversation
  const newConversation: Conversation = {
    id: `conv_${Date.now()}`,
    participants: [
      {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role as any,
        isOnline: true
      },
      {
        id: stylistId,
        name: getStylistName(stylistId),
        role: 'stylist',
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
    starred: false
  };
  
  // Store the new conversation
  const updatedConversations = [newConversation, ...existingConversations];
  storeConversations(updatedConversations);
  
  return newConversation;
};

// Get conversations from localStorage
const getStoredConversations = (): Conversation[] => {
  const stored = localStorage.getItem('sop_conversations');
  return stored ? JSON.parse(stored) : [];
};

// Store conversations to localStorage
const storeConversations = (conversations: Conversation[]): void => {
  localStorage.setItem('sop_conversations', JSON.stringify(conversations));
};

// Mock stylist names (in real app, this would come from user database)
const getStylistName = (stylistId: string): string => {
  const stylistNames: Record<string, string> = {
    's1': 'Emma Style',
    's2': 'Sarah Chen',
    's3': 'Alex Rivera',
    's4': 'Maya Patel',
    's5': 'James Kim'
  };
  return stylistNames[stylistId] || 'Professional Stylist';
};

// Get total unread count
export const getTotalUnreadCount = (): number => {
  const conversations = getStoredConversations();
  return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
};

// Mark conversation as read
export const markConversationAsRead = (conversationId: string): void => {
  const conversations = getStoredConversations();
  const updated = conversations.map(conv => 
    conv.id === conversationId 
      ? { ...conv, unreadCount: 0 }
      : conv
  );
  storeConversations(updated);
};

// Mock socket events simulation
export const simulateSocketEvents = () => {
  // This would be replaced with real socket events in production
  const events = ['message:new', 'typing:start', 'typing:stop', 'presence:update'];
  
  return {
    emit: (event: string, data: any) => {
      console.log(`Socket emit: ${event}`, data);
    },
    on: (event: string, callback: (data: any) => void) => {
      console.log(`Socket listening: ${event}`);
      // Mock event simulation
      if (event === 'unread:total') {
        // Simulate unread count updates
        setInterval(() => {
          callback({ total: getTotalUnreadCount() });
        }, 5000);
      }
    },
    off: (event: string) => {
      console.log(`Socket stop listening: ${event}`);
    }
  };
};