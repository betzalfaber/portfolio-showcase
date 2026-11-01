import { createContext } from 'react';
import { AdminUser } from '../types';

export interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDemoMode: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
