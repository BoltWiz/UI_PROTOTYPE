export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'user' | 'admin' | 'stylist';
  defaultCity?: string;
  styleGoals?: string[];
  preferredColors?: string[];
  avoidedColors?: string[];
  // Stylist-specific fields
  bio?: string;
  socialLinks?: {
    instagram?: string;
    website?: string;
    portfolio?: string;
  };
  followerCount?: number;
  isVerifiedStylist?: boolean;
  specialties?: string[];
}

export interface Item {
  id: string;
  userId: string;
  type: 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';
  colors: string[];
  seasons: string[];
  occasions: string[];
  brand?: string;
  imageUrl: string;
  tags?: string[];
  name?: string;
}

export interface Weather {
  city: string;
  today: {
    tempC: number;
    condition: string;
    humidity: number;
  };
  forecast: Array<{
    day: string;
    tempC: number;
    condition: string;
  }>;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  dressCode: 'casual' | 'smart' | 'formal' | 'active';
}

export interface Schedule {
  today: ScheduleEvent[];
}

export interface Outfit {
  id: string;
  userId: string;
  itemIds: string[];
  context: {
    date: string;
    goal: string;
    weather?: {
      condition: string;
      tempC?: number;
    };
    occasion?: string;
  };
  explanation: string;
  score: number;
  isFavorite?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  image: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: Array<{
    userId: string;
    text: string;
    timestamp?: string;
  }>;
  status: 'visible' | 'hidden';
  reports: Array<{
    userId: string;
    reason: string;
    timestamp: string;
  }>;
  timestamp?: string;
}

export interface SuggestContext {
  goal: 'casual' | 'smart' | 'formal' | 'active';
  occasion?: string;
  season?: string;
  avoidRepeatDays?: number;
  lastUsedItemIds?: string[];
}

export interface Report {
  postId: string;
  userId: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

export interface OutfitCollection {
  id: string;
  stylistId: string;
  title: string;
  description: string;
  coverImage: string;
  itemIds: string[];
  tags: string[];
  trends: string[];
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  occasions: string[];
  isPublic: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface StyleGuide {
  id: string;
  stylistId: string;
  title: string;
  content: string; // Markdown content
  coverImage: string;
  images: string[];
  tags: string[];
  category: 'trend' | 'basics' | 'occasion' | 'color' | 'body-type';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number; // in minutes
  likes: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  userId: string;
  stylistId: string;
  question: string;
  answer?: string;
  images?: string[];
  status: 'pending' | 'answered' | 'closed';
  category: 'outfit' | 'styling' | 'shopping' | 'color' | 'general';
  createdAt: string;
  answeredAt?: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  type: 'stylist' | 'user';
  createdAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: 'hide_post' | 'approve_post' | 'ban_user' | 'unban_user' | 'delete_content' | 'restore_content';
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  reason?: string;
  metadata?: any;
  timestamp: string;
}

export interface SystemStats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
  activeUsers24h: number;
  newUsersToday: number;
  postsToday: number;
  reportsToday: number;
}

// Stylist-specific types
export interface StylistProfile {
  id: string;
  userId: string;
  bio?: string;
  specialties?: string[];
  socialLinks?: {
    instagram?: string;
    website?: string;
    portfolio?: string;
  };
  acceptsRequests: boolean;
  followers: number;
  isVerified: boolean;
}

export interface StylistCollection {
  id: string;
  stylistId: string;
  title: string;
  description: string;
  coverUrl?: string;
  tags: string[];
  palette?: string[];
  seasons?: ('spring' | 'summer' | 'autumn' | 'winter')[];
  occasions?: ('casual' | 'smart' | 'formal' | 'sport' | 'travel')[];
  visibility: 'public' | 'private' | 'draft';
  outfits: StylistOutfit[];
  stats?: {
    views: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StylistOutfit {
  id: string;
  title: string;
  items: string[];
  imageUrl?: string;
  description?: string;
}

export interface StylistTip {
  id: string;
  stylistId: string;
  title: string;
  coverUrl?: string;
  contentMd: string;
  tags: string[];
  category: 'trend' | 'basics' | 'occasion' | 'color' | 'body-type';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  status: 'draft' | 'published';
  stats?: {
    views: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ConsultRequest {
  id: string;
  fromUserId: string;
  toStylistId: string;
  message: string;
  dressCode?: 'casual' | 'smart' | 'formal' | 'sport';
  eventDate?: string;
  wardrobeLink?: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
  updatedAt?: string;
}

export interface StylistStats {
  totalCollections: number;
  totalTips: number;
  totalViews: number;
  totalLikes: number;
  followersCount: number;
  requestsThisWeek: number;
}

// Re-export challenge types
export * from './challenges';