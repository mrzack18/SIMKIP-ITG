import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserSession } from "@/types";
import { getCurrentUser, logout as authLogout } from "@/services/authService";

interface AuthContextValue {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from localStorage on mount
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
    setIsLoading(false);
  }, []);

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the auth context.
 * Must be used inside <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
