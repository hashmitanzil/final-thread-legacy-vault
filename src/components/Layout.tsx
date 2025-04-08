
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
}

interface ExtendedUser extends User {
  name?: string;
  email: string;
  avatar?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Create a formatted user object with required fields
  const formattedUser = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url
  } : null;

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation 
        user={formattedUser} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
