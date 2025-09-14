export type Role = 'user' | 'stylist' | 'admin';

export interface UserMini {
  id: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Conversation {
  id: string;
  participants: UserMini[];
  lastMessage?: string;
  unreadCount?: number;
  updatedAt: string;
  starred?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: UserMini;
  type: 'text' | 'image';
  content: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  readBy?: string[];
}

export type MessageFilter = 'all' | 'unread' | 'starred';