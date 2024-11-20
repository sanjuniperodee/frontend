// For development, we'll use console logging instead of Sentry
export const initSentry = () => {
    // Only initialize in production
    if (import.meta.env.PROD) {
        console.log('Sentry would be initialized in production');
    }
};
export const captureError = (error, context) => {
    console.error('Error:', error);
    if (context) {
        console.error('Context:', context);
    }
};
