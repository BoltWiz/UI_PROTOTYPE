import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('sop_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const mockUsers = [
      { id: 'u1', name: 'Minh', email: 'minh@example.com', password: '123456', role: 'user' as const, defaultCity: 'Ho Chi Minh', styleGoals: ['formal', 'standout'], preferredColors: ['navy', 'white'], avoidedColors: ['neon'] },
      { id: 'admin', name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' as const, defaultCity: 'Ho Chi Minh', styleGoals: [], preferredColors: [], avoidedColors: [] },
      { id: 's1', name: 'Emma Style', email: 'stylist@example.com', password: 'stylist123', role: 'stylist' as const, defaultCity: 'Ho Chi Minh', styleGoals: [], preferredColors: [], avoidedColors: [], bio: 'Fashion stylist with 8+ years experience', followerCount: 2500, isVerifiedStylist: true, specialties: ['formal', 'minimalist', 'corporate'] },
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('sop_current_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      role: 'user',
      defaultCity: 'Ho Chi Minh',
      styleGoals: [],
      preferredColors: [],
      avoidedColors: []
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('sop_current_user', JSON.stringify(newUser));
    return true;
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'user',
      defaultCity: 'Ho Chi Minh',
      styleGoals: ['casual'],
      preferredColors: ['navy', 'white'],
      avoidedColors: []
    };

    setUser(guestUser);
    setIsAuthenticated(true);
    localStorage.setItem('sop_current_user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sop_current_user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      loginAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
}