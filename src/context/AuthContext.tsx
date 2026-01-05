import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'admin';
  phone?: string;
  ecoPoints: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  updateEcoPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call backend API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user data based on email
    let mockUser: User;
    if (email === 'admin@evolve.com') {
      mockUser = {
        id: '1',
        name: 'Admin User',
        email,
        role: 'admin',
        ecoPoints: 5000
      };
    } else if (email === 'host@evolve.com') {
      mockUser = {
        id: '2',
        name: 'Host User',
        email,
        role: 'host',
        phone: '+91-9876543210',
        ecoPoints: 2500
      };
    } else {
      mockUser = {
        id: '3',
        name: email.split('@')[0],
        email,
        role: 'user',
        phone: '+91-9876543210',
        ecoPoints: 850
      };
    }
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const register = async (name: string, email: string, password: string, role: string = 'user') => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'user' | 'host' | 'admin',
      ecoPoints: 0
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateEcoPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, ecoPoints: user.ecoPoints + points };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateEcoPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
