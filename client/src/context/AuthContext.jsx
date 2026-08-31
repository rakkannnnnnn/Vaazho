import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("vazho_token") || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("vazho_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Validate token and synchronize current user on mount
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("vazho_token");
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (isMounted && res.success && res.user) {
          setUser(res.user);
          localStorage.setItem("vazho_user", JSON.stringify(res.user));
        } else {
          logout();
        }
      } catch (err) {
        console.warn("Auth token invalid or expired:", err.message);
        logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("vazho_token", res.token);
      localStorage.setItem("vazho_user", JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("vazho_token", res.token);
      localStorage.setItem("vazho_user", JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("vazho_token");
    localStorage.removeItem("vazho_user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
