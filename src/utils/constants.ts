// Map constants
export const MAP_CONFIG = {
  DEFAULT_CENTER: [55.7558, 37.6173] as [number, number],
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
};

// Reputation constants
export const REPUTATION = {
  MARKER_APPROVED: 10,
  MARKER_REJECTED: -5,
  COMMENT_LIKED: 2,
  REPORT_ACCEPTED: 5,
  LEVELS: {
    NOVICE: { min: 0, max: 99 },
    CONTRIBUTOR: { min: 100, max: 499 },
    EXPERT: { min: 500, max: 999 },
    MASTER: { min: 1000, max: Infinity },
  },
};

// Moderation constants
export const MODERATION = {
  QUEUE_PAGE_SIZE: 10,
  AUTO_MODERATION_TYPES: ['spam', 'offensive', 'quality'] as const,
  ACTION_TYPES: ['approve', 'reject', 'warn', 'ban'] as const,
};

// UI constants
export const UI = {
  MARKERS_PER_PAGE: 10,
  NOTIFICATIONS_LIMIT: 50,
  MOBILE_BREAKPOINT: 768,
};