// ============================================
// Auth Context - Mock authentication state
// Replace with real JWT auth when connecting backend
// ============================================

import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole } from "@/types";
import api from "@/lib/api";
import { mapUser } from "@/lib/mappers";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? (JSON.parse(savedUser) as User) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      const mappedUser = mapUser(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(mappedUser));
      setUser(mappedUser);
      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
      try {
        const { data } = await api.post("/users", { name, email, password, role });
        const mappedUser = mapUser(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(mappedUser));
        setUser(mappedUser);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // Demo helper to switch between admin/customer views
  const switchRole = useCallback(
    (role: UserRole) => {
      if (user) setUser({ ...user, role });
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
