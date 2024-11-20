import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import MapComponent from './components/Map/MapComponent';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import AdminPanel from './components/Admin/AdminPanel';
import UserProfile from './components/Profile/UserProfile';
import HomePage from './components/Home/HomePage';
import MarkersList from './components/Markers/MarkersList';
import { useAuthStore } from './store/authStore';
import {useEffect} from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole = 'user' }: { children: React.ReactNode; requiredRole?: 'user' | 'advanced' | 'admin' }) {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin' && user != null) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus
  }, [checkAuthStatus]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapComponent />} />
              <Route path="/markers" element={<MarkersList />} />

              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/map" replace /> : (
                  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full">
                      <LoginForm />
                    </div>
                  </div>
                )
              } />

              <Route path="/register" element={
                isAuthenticated ? <Navigate to="/map" replace /> : (
                  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full">
                      <RegisterForm />
                    </div>
                  </div>
                )
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <UserProfile />
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}