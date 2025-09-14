import { AdminUser, UserStatus, Role, ModerationItem, Report, AuditLog, SystemStats, AdminSettings } from '@/types/admin';
import { User } from '@/types';

// Mock data for admin functions
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Minh',
    email: 'minh@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    lastSeen: '2024-01-20T10:30:00Z',
    isVerified: true,
    postsCount: 25,
    reportsCount: 0
  },
  {
    id: 's1',
    name: 'Emma Style',
    email: 'emma@example.com',
    role: 'stylist',
    status: 'verified',
    createdAt: '2024-01-10T08:00:00Z',
    lastSeen: '2024-01-20T14:15:00Z',
    isVerified: true,
    postsCount: 120,
    reportsCount: 0
  },
  {
    id: 'u2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'flagged',
    createdAt: '2024-01-18T08:00:00Z',
    lastSeen: '2024-01-19T16:20:00Z',
    isVerified: false,
    postsCount: 5,
    reportsCount: 3
  },
  {
    id: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T08:00:00Z',
    lastSeen: '2024-01-20T15:45:00Z',
    isVerified: true,
    postsCount: 0,
    reportsCount: 0
  }
];

export const mockModerationItems: ModerationItem[] = [
  {
    id: 'mod1',
    target: { type: 'post', id: 'p1' },
    authorId: 'u2',
    authorName: 'John Doe',
    content: 'Check out this amazing outfit!',
    thumbnail: '/mock/outfit1.jpg',
    reasonFlags: ['spam'],
    state: 'pending',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'mod2',
    target: { type: 'post', id: 'p2' },
    authorId: 'u1',
    authorName: 'Minh',
    content: 'Perfect for winter days',
    thumbnail: '/mock/outfit2.jpg',
    reasonFlags: ['inappropriate'],
    state: 'flagged',
    createdAt: '2024-01-20T09:30:00Z'
  }
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    reporterId: 'u1',
    reporterName: 'Minh',
    target: { type: 'post', id: 'p1' },
    reason: 'spam',
    description: 'This post is promoting external links inappropriately',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-01-20T10:15:00Z'
  },
  {
    id: 'r2',
    reporterId: 's1',
    reporterName: 'Emma Style',
    target: { type: 'comment', id: 'c1' },
    reason: 'harassment',
    description: 'Inappropriate comments targeting users',
    status: 'in_review',
    assignedTo: 'admin',
    assignedToName: 'Admin',
    priority: 'high',
    createdAt: '2024-01-20T08:45:00Z'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log1',
    actorId: 'admin',
    actorName: 'Admin',
    action: 'BAN',
    target: { type: 'user', id: 'u3', name: 'Spam User' },
    metadata: { reason: 'Multiple spam violations', duration: 'permanent' },
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'log2',
    actorId: 'admin',
    actorName: 'Admin',
    action: 'APPROVE',
    target: { type: 'post', id: 'p5' },
    metadata: { previousState: 'pending' },
    createdAt: '2024-01-20T13:15:00Z'
  }
];

export const mockSystemStats: SystemStats = {
  totalUsers: 1247,
  activeUsers24h: 89,
  totalPosts: 3456,
  pendingModeration: 12,
  openReports: 8,
  newUsersToday: 15,
  postsToday: 47,
  reportsToday: 3,
  usersByDay: [
    { date: '2024-01-14', count: 8 },
    { date: '2024-01-15', count: 12 },
    { date: '2024-01-16', count: 6 },
    { date: '2024-01-17', count: 14 },
    { date: '2024-01-18', count: 9 },
    { date: '2024-01-19', count: 11 },
    { date: '2024-01-20', count: 15 }
  ],
  postsByDay: [
    { date: '2024-01-14', count: 34 },
    { date: '2024-01-15', count: 42 },
    { date: '2024-01-16', count: 28 },
    { date: '2024-01-17', count: 51 },
    { date: '2024-01-18', count: 38 },
    { date: '2024-01-19', count: 45 },
    { date: '2024-01-20', count: 47 }
  ]
};

export const mockAdminSettings: AdminSettings = {
  autoFlagThreshold: 3,
  wordBlacklist: ['spam', 'fake', 'scam'],
  maxImageSize: 5242880, // 5MB
  maxPostsPerDay: 50,
  enableAutoModeration: true
};

// Admin API functions
export const getAdminUsers = (params?: {
  search?: string;
  role?: Role;
  status?: UserStatus;
  page?: number;
  size?: number;
}) => {
  let users = [...mockAdminUsers];
  
  if (params?.search) {
    const search = params.search.toLowerCase();
    users = users.filter(u => 
      u.name.toLowerCase().includes(search) || 
      u.email.toLowerCase().includes(search)
    );
  }
  
  if (params?.role && params.role !== 'guest') {
    users = users.filter(u => u.role === params.role);
  }
  
  if (params?.status) {
    users = users.filter(u => u.status === params.status);
  }
  
  return {
    data: users,
    total: users.length,
    page: params?.page || 1,
    size: params?.size || 10
  };
};

export const updateUserStatus = (userId: string, status: UserStatus, reason?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock API call
      const auditLog: AuditLog = {
        id: `log_${Date.now()}`,
        actorId: 'admin',
        actorName: 'Admin',
        action: status === 'banned' ? 'BAN' : 'UNBAN',
        target: { type: 'user', id: userId },
        metadata: { reason, previousStatus: 'active' },
        createdAt: new Date().toISOString()
      };
      mockAuditLogs.unshift(auditLog);
      resolve(true);
    }, 500);
  });
};

export const updateUserRole = (userId: string, role: Role, reason?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const auditLog: AuditLog = {
        id: `log_${Date.now()}`,
        actorId: 'admin',
        actorName: 'Admin',
        action: 'CHANGE_ROLE',
        target: { type: 'user', id: userId },
        metadata: { newRole: role, reason },
        createdAt: new Date().toISOString()
      };
      mockAuditLogs.unshift(auditLog);
      resolve(true);
    }, 500);
  });
};

export const getModerationItems = (state?: string) => {
  if (state && state !== 'all') {
    return mockModerationItems.filter(item => item.state === state);
  }
  return mockModerationItems;
};

export const moderateContent = (
  itemId: string, 
  action: 'approve' | 'remove', 
  reason?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const auditLog: AuditLog = {
        id: `log_${Date.now()}`,
        actorId: 'admin',
        actorName: 'Admin',
        action: action === 'approve' ? 'APPROVE' : 'REMOVE',
        target: { type: 'post', id: itemId },
        metadata: { reason },
        createdAt: new Date().toISOString()
      };
      mockAuditLogs.unshift(auditLog);
      resolve(true);
    }, 500);
  });
};

export const getReports = (status?: string) => {
  if (status && status !== 'all') {
    return mockReports.filter(report => report.status === status);
  }
  return mockReports;
};

export const assignReport = (reportId: string, adminId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const auditLog: AuditLog = {
        id: `log_${Date.now()}`,
        actorId: 'admin',
        actorName: 'Admin',
        action: 'ASSIGN_REPORT',
        target: { type: 'report', id: reportId },
        metadata: { assignedTo: adminId },
        createdAt: new Date().toISOString()
      };
      mockAuditLogs.unshift(auditLog);
      resolve(true);
    }, 500);
  });
};

export const resolveReport = (
  reportId: string, 
  resolution: string, 
  note?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const auditLog: AuditLog = {
        id: `log_${Date.now()}`,
        actorId: 'admin',
        actorName: 'Admin',
        action: 'RESOLVE_REPORT',
        target: { type: 'report', id: reportId },
        metadata: { resolution, note },
        createdAt: new Date().toISOString()
      };
      mockAuditLogs.unshift(auditLog);
      resolve(true);
    }, 500);
  });
};

export const getSystemStats = (): SystemStats => mockSystemStats;
export const getAuditLogs = (): AuditLog[] => mockAuditLogs;
export const getAdminSettings = (): AdminSettings => mockAdminSettings;

export const updateAdminSettings = (settings: Partial<AdminSettings>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(mockAdminSettings, settings);
      const auditLog: AuditLog = {
        id: `log_${Date.now()}`,
        actorId: 'admin',
        actorName: 'Admin',
        action: 'UPDATE_SETTING',
        metadata: { settings },
        createdAt: new Date().toISOString()
      };
      mockAuditLogs.unshift(auditLog);
      resolve(true);
    }, 500);
  });
};