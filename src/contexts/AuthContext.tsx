import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phoneNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('chatapp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists (simulate database lookup)
      const users = JSON.parse(localStorage.getItem('chatapp_users') || '[]');
      const existingUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (existingUser) {
        const userData = { 
          id: existingUser.id, 
          email: existingUser.email, 
          name: existingUser.name,
          phoneNumber: existingUser.phoneNumber || ''
        };
        setUser(userData);
        localStorage.setItem('chatapp_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phoneNumber: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('chatapp_users') || '[]');
      if (users.find((u: any) => u.email === email)) {
        return false; // User already exists
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phoneNumber,
        password
      };
      
      users.push(newUser);
      localStorage.setItem('chatapp_users', JSON.stringify(users));
      
      const userData = { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name,
        phoneNumber: newUser.phoneNumber
      };
      setUser(userData);
      localStorage.setItem('chatapp_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatapp_user');
    localStorage.removeItem('chatapp_activeChat');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};