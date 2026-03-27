import { createContext, useContext } from 'react';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'Member' | 'Admin';
  status: 'active' | 'inactive';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
