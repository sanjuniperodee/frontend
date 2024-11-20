// User types
export interface User {
  id: string;
  login: string;
  role: 'user' | 'admin';
  reputation?: number;
  createdAt: string;
  avatar?: string;
  achievements: Achievement[];
}

// Marker types
export interface Marker {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  userId: string;
  createdAt: string;
  approved: boolean;
  rating: number;
  comments?: Comment[];
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Comment types
export interface Comment {
  id: string;
  text: string;
  userId: string;
  markerId: string;
  createdAt: string;
  rating: number;
}

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'markers' | 'comments' | 'ratings' | 'special';
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

// Reputation types
export interface ReputationEvent {
  id: string;
  type: string;
  points: number;
  reason: string;
  createdAt: string;
}

// Moderation types
export interface ModerationTemplate {
  id: string;
  name: string;
  type: 'marker' | 'comment' | 'user';
  action: 'approve' | 'reject' | 'warn' | 'ban';
  reputationChange: number;
  reason: string;
  autoApply: {
    enabled: boolean;
    conditions: {
      field: string;
      operator: 'contains' | 'equals' | 'greater' | 'less';
      value: string;
    }[];
  };
}

export interface AutoModerationRule {
  id: string;
  name: string;
  type: 'spam' | 'offensive' | 'quality';
  condition: {
    field: string;
    operator: 'contains' | 'matches' | 'threshold';
    value: string | number;
  };
  action: 'approve' | 'reject' | 'flag';
  enabled: boolean;
  templateId?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'marker_approved' | 'new_comment' | 'marker_rejected';
  message: string;
  createdAt: string;
  read: boolean;
}

// Analytics types
export interface AnalyticsData {
  activityHeatmap: {
    value: number;
    day: string;
  }[];
  userGrowth: {
    date: string;
    total: number;
    active: number;
  }[];
  markerDistribution: {
    category: string;
    count: number;
    approved: number;
    rejected: number;
  }[];
  reputationTrends: {
    date: string;
    averageReputation: number;
    topUserReputation: number;
  }[];
}