import { User, Item, Weather, Schedule, Outfit, Post, OutfitCollection, StyleGuide, Consultation, AdminAction, SystemStats } from '@/types';
import usersData from '@/data/users.json';
import itemsData from '@/data/items.json';
import weatherData from '@/data/weather.json';
import scheduleData from '@/data/schedule.json';
import historyData from '@/data/history.json';
import postsData from '@/data/posts.json';
import collectionsData from '@/data/stylist-collections.json';
import stylistGuidesData from '@/data/style-guides.json';
import consultationsData from '@/data/consultations.json';
import adminActionsData from '@/data/admin-actions.json';

// Mock current user (in real app, this would come from auth)
export const getCurrentUser = (): User => {
  const savedUser = localStorage.getItem('sop_current_user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  
  // Fallback to default user if no saved user
  return {
    id: "u1",
    name: "Minh",
    email: "minh@example.com",
    role: "user",
    defaultCity: "Ho Chi Minh",
    styleGoals: ["formal", "standout"],
    preferredColors: ["navy", "white"],
    avoidedColors: ["neon"]
  };
};

// Load data from JSON files
export const getUsers = (): User[] => usersData as User[];
export const getItems = (userId?: string): Item[] => {
  const items = itemsData as Item[];
  return userId ? items.filter(item => item.userId === userId) : items;
};

export const getWeatherData = (): Weather => weatherData as Weather;
export const getScheduleData = (): Schedule => scheduleData as Schedule;

// Get outfit history from localStorage or mock data
export const getOutfitHistory = (userId: string): Outfit[] => {
  const stored = localStorage.getItem('outfit_history');
  if (stored) {
    const history = JSON.parse(stored) as Outfit[];
    return history.filter(outfit => outfit.userId === userId);
  }
  return (historyData as Outfit[]).filter(outfit => outfit.userId === userId);
};

// Save outfit to history
export const saveOutfitToHistory = (outfit: Outfit): void => {
  const existing = getOutfitHistory(outfit.userId);
  const updated = [outfit, ...existing];
  localStorage.setItem('outfit_history', JSON.stringify(updated));
};

// Get favorite outfits
export const getFavoriteOutfits = (userId: string): Outfit[] => {
  return getOutfitHistory(userId).filter(outfit => outfit.isFavorite);
};

// Toggle favorite status
export const toggleFavorite = (outfitId: string, userId: string): void => {
  const history = getOutfitHistory(userId);
  const updated = history.map(outfit => 
    outfit.id === outfitId 
      ? { ...outfit, isFavorite: !outfit.isFavorite }
      : outfit
  );
  localStorage.setItem('outfit_history', JSON.stringify(updated));
};

// Get community posts
export const getCommunityPosts = (): Post[] => {
  const stored = localStorage.getItem('community_posts');
  if (stored) {
    return JSON.parse(stored) as Post[];
  }
  return postsData as Post[];
};

// Save community posts
export const saveCommunityPosts = (posts: Post[]): void => {
  localStorage.setItem('community_posts', JSON.stringify(posts));
};

// Add new post
export const addPost = (post: Omit<Post, 'id' | 'likes' | 'timestamp'>): Post => {
  const posts = getCommunityPosts();
  const newPost: Post = {
    ...post,
    id: `p${Date.now()}`,
    likes: 0,
    timestamp: new Date().toISOString()
  };
  const updated = [newPost, ...posts];
  saveCommunityPosts(updated);
  return newPost;
};

// Like/unlike post
export const togglePostLike = (postId: string): void => {
  const posts = getCommunityPosts();
  const updated = posts.map(post => 
    post.id === postId 
      ? { ...post, likes: Math.max(0, post.likes + (Math.random() > 0.5 ? 1 : -1)) }
      : post
  );
  saveCommunityPosts(updated);
};

// Report post
export const reportPost = (postId: string, reason: string, userId: string): void => {
  const posts = getCommunityPosts();
  const updated = posts.map(post => 
    post.id === postId 
      ? { 
          ...post, 
          reports: [...post.reports, {
            userId,
            reason,
            timestamp: new Date().toISOString()
          }]
        }
      : post
  );
  saveCommunityPosts(updated);
};

// Get user preferences
export const getUserPreferences = (userId: string) => {
  const stored = localStorage.getItem(`user_prefs_${userId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    avoidRepeatDays: 3,
    styleGoals: ['casual', 'smart'],
    defaultCity: 'Ho Chi Minh'
  };
};

// Save user preferences
export const saveUserPreferences = (userId: string, prefs: any): void => {
  localStorage.setItem(`user_prefs_${userId}`, JSON.stringify(prefs));
};

// Admin Actions
export const getAdminActions = (): AdminAction[] => {
  const stored = localStorage.getItem('admin_actions');
  if (stored) {
    return JSON.parse(stored) as AdminAction[];
  }
  return adminActionsData as AdminAction[];
};

export const logAdminAction = (action: Omit<AdminAction, 'id' | 'timestamp'>): void => {
  const actions = getAdminActions();
  const newAction: AdminAction = {
    ...action,
    id: `a${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  const updated = [newAction, ...actions];
  localStorage.setItem('admin_actions', JSON.stringify(updated));
};

// System Stats
export const getSystemStats = (): SystemStats => {
  const users = getUsers();
  const posts = getCommunityPosts();
  const reports = posts.reduce((sum, post) => sum + (post.reports?.length || 0), 0);
  
  return {
    totalUsers: users.length,
    totalPosts: posts.length,
    totalReports: reports,
    activeUsers24h: Math.floor(users.length * 0.3), // Mock: 30% active
    newUsersToday: Math.floor(Math.random() * 5) + 1,
    postsToday: Math.floor(Math.random() * 10) + 3,
    reportsToday: Math.floor(Math.random() * 3)
  };
};

// Stylist Collections
export const getStylistCollections = (stylistId?: string): OutfitCollection[] => {
  const stored = localStorage.getItem('stylist_collections');
  const collections = stored ? JSON.parse(stored) : collectionsData;
  return stylistId ? collections.filter(c => c.stylistId === stylistId) : collections;
};

export const saveStylistCollections = (collections: OutfitCollection[]): void => {
  localStorage.setItem('stylist_collections', JSON.stringify(collections));
};

export const addStylistCollection = (collection: Omit<OutfitCollection, 'id' | 'likes' | 'createdAt' | 'updatedAt'>): OutfitCollection => {
  const collections = getStylistCollections();
  const newCollection: OutfitCollection = {
    ...collection,
    id: `c${Date.now()}`,
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const updated = [newCollection, ...collections];
  saveStylistCollections(updated);
  return newCollection;
};

export const updateStylistCollection = (id: string, updates: Partial<OutfitCollection>): void => {
  const collections = getStylistCollections();
  const updated = collections.map(collection =>
    collection.id === id
      ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
      : collection
  );
  saveStylistCollections(updated);
};

export const deleteStylistCollection = (id: string): void => {
  const collections = getStylistCollections();
  const updated = collections.filter(collection => collection.id !== id);
  saveStylistCollections(updated);
};

// Style Guides
export const getStyleGuides = (stylistId?: string): StyleGuide[] => {
  const stored = localStorage.getItem('style_guides');
  const guides = stored ? JSON.parse(stored) : stylistGuidesData;
  return stylistId ? guides.filter(g => g.stylistId === stylistId) : guides;
};

export const saveStyleGuides = (guides: StyleGuide[]): void => {
  localStorage.setItem('style_guides', JSON.stringify(guides));
};

export const addStyleGuide = (guide: Omit<StyleGuide, 'id' | 'likes' | 'createdAt' | 'updatedAt'>): StyleGuide => {
  const guides = getStyleGuides();
  const newGuide: StyleGuide = {
    ...guide,
    id: `g${Date.now()}`,
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const updated = [newGuide, ...guides];
  saveStyleGuides(updated);
  return newGuide;
};

export const updateStyleGuide = (id: string, updates: Partial<StyleGuide>): void => {
  const guides = getStyleGuides();
  const updated = guides.map(guide =>
    guide.id === id
      ? { ...guide, ...updates, updatedAt: new Date().toISOString() }
      : guide
  );
  saveStyleGuides(updated);
};

export const deleteStyleGuide = (id: string): void => {
  const guides = getStyleGuides();
  const updated = guides.filter(guide => guide.id !== id);
  saveStyleGuides(updated);
};

// Consultations
export const getConsultations = (userId?: string, stylistId?: string): Consultation[] => {
  const stored = localStorage.getItem('consultations');
  let consultations = stored ? JSON.parse(stored) : consultationsData;
  
  if (userId) {
    consultations = consultations.filter(c => c.userId === userId);
  }
  if (stylistId) {
    consultations = consultations.filter(c => c.stylistId === stylistId);
  }
  
  return consultations;
};

export const saveConsultations = (consultations: Consultation[]): void => {
  localStorage.setItem('consultations', JSON.stringify(consultations));
};

export const addConsultation = (consultation: Omit<Consultation, 'id' | 'createdAt'>): Consultation => {
  const consultations = getConsultations();
  const newConsultation: Consultation = {
    ...consultation,
    id: `cons${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newConsultation, ...consultations];
  saveConsultations(updated);
  return newConsultation;
};

export const answerConsultation = (id: string, answer: string): void => {
  const consultations = getConsultations();
  const updated = consultations.map(consultation =>
    consultation.id === id
      ? { 
          ...consultation, 
          answer, 
          status: 'answered' as const,
          answeredAt: new Date().toISOString()
        }
      : consultation
  );
  saveConsultations(updated);
};

// Follow System
export const getFollows = (): any[] => {
  const stored = localStorage.getItem('follows');
  return stored ? JSON.parse(stored) : [];
};

export const followStylist = (followerId: string, stylistId: string): void => {
  const follows = getFollows();
  const newFollow = {
    id: `f${Date.now()}`,
    followerId,
    followingId: stylistId,
    type: 'stylist',
    createdAt: new Date().toISOString()
  };
  const updated = [newFollow, ...follows];
  localStorage.setItem('follows', JSON.stringify(updated));
};

export const unfollowStylist = (followerId: string, stylistId: string): void => {
  const follows = getFollows();
  const updated = follows.filter(follow => 
    !(follow.followerId === followerId && follow.followingId === stylistId)
  );
  localStorage.setItem('follows', JSON.stringify(updated));
};

export const isFollowingStylist = (followerId: string, stylistId: string): boolean => {
  const follows = getFollows();
  return follows.some(follow => 
    follow.followerId === followerId && follow.followingId === stylistId
  );
};