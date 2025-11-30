import React, { createContext, useState, useContext } from "react";
import { MockDatabase } from "../services/mockApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("cine_active_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // 1. Check existence (Step 1 of Auth)
  const checkUserExists = async (phone) => {
    return await MockDatabase.loginUser(phone);
  };

  // 2. Register (Step 3 of Auth)
  const register = async (payload) => {
    const newUser = await MockDatabase.registerUser(payload);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem("cine_active_user", JSON.stringify(newUser));
    }
    return newUser;
  };

  // 3. Direct Login (If user found)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("cine_active_user", JSON.stringify(userData));
  };

  // 4. Update
  const updateProfile = async (updates) => {
    if (!user) return { error: "No user" };
    setLoading(true);
    const result = await MockDatabase.updateUserProfile(user.userId, updates);

    if (result && !result.error) {
      setUser(result);
      localStorage.setItem("cine_active_user", JSON.stringify(result));
    }
    setLoading(false);
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cine_active_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        checkUserExists,
        register,
        login,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
