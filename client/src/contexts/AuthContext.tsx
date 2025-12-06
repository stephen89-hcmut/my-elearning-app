import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username: string, password: string) => {
    // Simulate API call with 500ms delay
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock credentials
        const mockUsers: Record<string, { password: string; user: User }> = {
          sManager: {
            password: 'password123',
            user: {
              id: '1',
              username: 'sManager',
              email: 'manager@educore.vn',
              firstName: 'Quản',
              lastName: 'Lý',
              role: 'admin',
              avatar: 'MS',
            },
          },
          instructor: {
            password: 'password123',
            user: {
              id: '2',
              username: 'instructor',
              email: 'instructor@educore.vn',
              firstName: 'Giảng',
              lastName: 'Viên',
              role: 'instructor',
              avatar: 'GV',
            },
          },
          student: {
            password: 'password123',
            user: {
              id: '3',
              username: 'student',
              email: 'student@educore.vn',
              firstName: 'Sinh',
              lastName: 'Viên',
              role: 'student',
              avatar: 'SV',
            },
          },
        };

        const mockUser = mockUsers[username];
        if (mockUser && mockUser.password === password) {
          setUser(mockUser.user);
          localStorage.setItem('user', JSON.stringify(mockUser.user));
          resolve();
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
