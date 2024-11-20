// Simple analytics wrapper for development
const analytics = {
  track: async (event: string, properties?: Record<string, any>) => {
    console.log('Analytics Event:', { event, properties });
  },
  page: async (page: string) => {
    console.log('Page View:', page);
  },
  identify: async (userId: string, traits?: Record<string, any>) => {
    console.log('User Identified:', { userId, traits });
  }
};

export const trackEvent = async (event: string, properties?: Record<string, any>) => {
  if (import.meta.env.DEV) {
    console.log('Analytics Event (Dev):', { event, properties });
    return;
  }
  await analytics.track(event, properties);
};

export const trackPageView = async (page: string) => {
  if (import.meta.env.DEV) {
    console.log('Analytics Page View (Dev):', page);
    return;
  }
  await analytics.page(page);
};

export const identifyUser = async (userId: string, traits?: Record<string, any>) => {
  if (import.meta.env.DEV) {
    console.log('Analytics Identify (Dev):', { userId, traits });
    return;
  }
  await analytics.identify(userId, traits);
};