import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type User } from './AuthContext';
import { authService } from '../services/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ตรวจสอบ session จาก cookie ตอน app เริ่ม
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authService.getProfile();
        if (data.login && data.memEmail) {
          setUser({
            memEmail: data.memEmail,
            memName:  data.memName,
            dutyId:   data.dutyId,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = (userData: User) => setUser(userData);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
