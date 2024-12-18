import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './utils/errorBoundary';
import App from './App';
import './index.css';
import { initSentry } from './utils/sentry';
import { trackPageView } from './utils/analytics';
// Initialize Sentry in production
if (import.meta.env.PROD) {
    initSentry();
}
// Track initial page view
trackPageView(window.location.pathname);
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(HelmetProvider, { children: _jsx(App, {}) }) }) }));
