/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/api/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("getplaced_token") || null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch current user details on mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoaded(true);
        return;
      }
      try {
        const userData = await apiFetch("/auth/me");
        setUser({
          ...userData,
          unsafeMetadata: {
            role: userData.role?.toLowerCase() || "candidate",
          },
        });
      } catch (err) {
        console.error("Failed to authenticate token:", err);
        logout();
      } finally {
        setIsLoaded(true);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("getplaced_token", data.token);
    setToken(data.token);

    const userObj = {
      ...data.user,
      unsafeMetadata: {
        role: data.user.role?.toLowerCase() || "candidate",
      },
    };
    setUser(userObj);
    return userObj;
  };

  const register = async (name, email, password, role) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        role: role.toUpperCase(),
      }),
    });

    localStorage.setItem("getplaced_token", data.token);
    setToken(data.token);

    const userObj = {
      ...data.user,
      unsafeMetadata: {
        role: data.user.role?.toLowerCase() || "candidate",
      },
    };
    setUser(userObj);
    return userObj;
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const userData = await apiFetch("/auth/me");
      setUser({
        ...userData,
        unsafeMetadata: {
          role: userData.role?.toLowerCase() || "candidate",
        },
      });
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const updateUserState = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
      unsafeMetadata: {
        role: (updatedUser.role || prev?.role)?.toLowerCase() || "candidate",
      },
    }));
  };

  const logout = () => {
    localStorage.removeItem("getplaced_token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoaded,
    isSignedIn: !!user,
    login,
    register,
    logout,
    refreshUser,
    updateUserState,
    // Helper to get raw JWT token string for legacy custom fetchers
    getToken: async () => token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Compatibility hook matching @clerk/clerk-react useUser() interface
export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useAuth();
  return { user, isLoaded, isSignedIn };
};
