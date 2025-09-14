export type Role = 'guest' | 'user' | 'stylist' | 'admin';
export type UserStatus = 'active' | 'banned' | 'flagged' | 'verified';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  lastSeen?: string;
  isVerified?: boolean;
  postsCount?: number;
  reportsCount?: number;
}

export interface ModerationTarget {
  type: 'post' | 'comment' | 'image';
  id: string;
}

export interface ModerationItem {
  id: string;
  target: ModerationTarget;
  authorId: string;
  authorName: string;
  content: string;
  thumbnail?: string;
  reasonFlags: string[];
  state: 'pending' | 'flagged' | 'approved' | 'removed';
  createdAt: string;
  updatedAt?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  target: ModerationTarget;
  reason: string;
  description?: string;
  status: 'open' | 'in_review' | 'resolved';
  assignedTo?: string;
  assignedToName?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: 'BAN' | 'UNBAN' | 'VERIFY' | 'CHANGE_ROLE' | 'APPROVE' | 'REMOVE' | 'ASSIGN_REPORT' | 'RESOLVE_REPORT' | 'UPDATE_SETTING';
  target?: {
    type: 'user' | 'post' | 'comment' | 'image' | 'report';
    id: string;
    name?: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers24h: number;
  totalPosts: number;
  pendingModeration: number;
  openReports: number;
  newUsersToday: number;
  postsToday: number;
  reportsToday: number;
  usersByDay: Array<{ date: string; count: number }>;
  postsByDay: Array<{ date: string; count: number }>;
}

export interface AdminSettings {
  autoFlagThreshold: number;
  wordBlacklist: string[];
  maxImageSize: number;
  maxPostsPerDay: number;
  enableAutoModeration: boolean;
}