import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (u: User) => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("shopnest_user") || "null"); } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("shopnest_token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.get("/auth/me").then((r) => {
        setUser(r.data);
        localStorage.setItem("shopnest_user", JSON.stringify(r.data));
      }).catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("shopnest_token", data.token);
      localStorage.setItem("shopnest_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: RegisterData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      localStorage.setItem("shopnest_token", data.token);
      localStorage.setItem("shopnest_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("shopnest_token");
    localStorage.removeItem("shopnest_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (u: User) => {
    setUser(u);
    localStorage.setItem("shopnest_user", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
