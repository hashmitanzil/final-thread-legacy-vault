
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastLogin: string;
  nextRequiredLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to calculate next required login date (30 days from now)
  const calculateNextRequiredLogin = (): string => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    return nextDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    // Check if user is already logged in from local storage
    const storedUser = localStorage.getItem('final_thread_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Update the last login date to today
        const today = new Date().toISOString().split('T')[0];
        const updatedUser = {
          ...parsedUser,
          lastLogin: today,
          nextRequiredLogin: calculateNextRequiredLogin(),
        };
        
        setUser(updatedUser);
        localStorage.setItem('final_thread_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('final_thread_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a call to your authentication endpoint
      if (email === 'demo@finalthread.com' && password === 'password') {
        const today = new Date().toISOString().split('T')[0];
        const user: User = {
          id: '1',
          name: 'Demo User',
          email: 'demo@finalthread.com',
          avatar: '', // Could add a demo avatar URL here
          lastLogin: today,
          nextRequiredLogin: calculateNextRequiredLogin(),
        };
        
        setUser(user);
        localStorage.setItem('final_thread_user', JSON.stringify(user));
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        return;
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const today = new Date().toISOString().split('T')[0];
      // In a real app, this would be a call to your registration endpoint
      const user: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        avatar: '', // Could generate a placeholder avatar
        lastLogin: today,
        nextRequiredLogin: calculateNextRequiredLogin(),
      };
      
      setUser(user);
      localStorage.setItem('final_thread_user', JSON.stringify(user));
      toast({
        title: 'Registration successful',
        description: 'Your account has been created.',
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('final_thread_user');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be a call to your account deletion endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark account for deletion in 15 days (in a real app)
      logout();
      
      toast({
        title: 'Account scheduled for deletion',
        description: 'Your account will be permanently deleted after 15 days.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete your account. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};
