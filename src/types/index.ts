export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  plan: 'FREE' | 'PRO';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED';
  userId: string;
  createdAt: string;
  updatedAt: string;
  nodes?: Node[];
  _count?: { nodes: number };
}

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  nodesCount: number;
}

export interface Node {
  id: string;
  type: 'MESSAGE' | 'BUTTON' | 'CONDITION' | 'DELAY' | 'PAYMENT';
  name: string;
  content?: Record<string, unknown>;
  position?: { x: number; y: number };
  funnelId: string;
}

export interface Subscription {
  id: string;
  plan: 'FREE' | 'PRO';
  status: string;
  limits: {
    maxFunnels: number;
    maxLeadsPerMonth: number;
    features: string[];
  };
}

export interface FunnelAnalytics {
  summary: {
    totalStarted: number;
    completed: number;
    paid: number;
    totalRevenue: number;
    conversionToPaid: string;
  };
  dailyStats: Array<{ date: string; started: number; completed: number; paid: number }>;
  recentSessions: Array<{ id: string; visitorName: string; status: string; startedAt: string }>;
}

export interface RecentSession {
  id: string;
  visitorName: string;
  funnelName: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED' | 'PAID';
  startedAt: string;
}

export interface UserAnalytics {
  summary: {
    totalFunnels: number;
    activeFunnels: number;
    totalStarted: number;
    totalCompleted: number;
    totalPaid: number;
    totalRevenue: number;
    overallConversion: string;
  };
  funnels: Array<{
    id: string;
    name: string;
    status: string;
    nodesCount: number;
    stats: { started: number; completed: number; paid: number; revenue: number; conversion: string };
  }>;
  recentSessions: RecentSession[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
