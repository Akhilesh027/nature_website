import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

interface RegisterData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  age?: string;
  gender?: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "https://beauty-backend1.onrender.com/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("userData");
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        const userData: User = {
          id: data.user?.id || data.user?._id || data.userId,
          ...data.user,
        };

        setToken(data.token);
        setUser(userData);

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userId", userData.id);

        return { success: true };
      }

      return { success: false, message: data.message || "Login failed" };
    } catch (error: any) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.message || "Network error. Please try again." 
      };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName || "",
          email: data.email,
          password: data.password,
          phone: data.phone || "",
          age: data.age || "",
          gender: data.gender || "",
          referralCode: data.referralCode?.trim().toUpperCase() || "",
        }),
      });

      const result = await response.json();

      if (result.success && result.token) {
        const userData: User = {
          id: result.user?.id || result.user?._id,
          ...result.user,
        };

        setToken(result.token);
        setUser(userData);

        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userId", userData.id);

        return { success: true };
      }

      return { success: false, message: result.message || "Registration failed" };
    } catch (error: any) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: error.message || "Network error. Please try again." 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user && !!token,
        isLoading,
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
