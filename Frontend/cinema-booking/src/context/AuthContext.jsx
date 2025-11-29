import React, { createContext, useState, useContext } from "react"; // Removed useEffect import
import { MockDatabase } from "../services/mockApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // FIX 1: Lazy Initialization
  // We pass a function to useState. It runs ONLY once on boot.
  // No useEffect needed = No linter error.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("cine_active_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false); // Default to false since we load user instantly above

  // Login Action
  const login = async (phoneNumber) => {
    setLoading(true); // Optional: UI loading state for the modal
    const userData = await MockDatabase.findOrCreateUser(phoneNumber);
    setUser(userData);
    localStorage.setItem("cine_active_user", JSON.stringify(userData));
    setLoading(false);
    return userData;
  };

  // Logout Action
  const logout = () => {
    setUser(null);
    localStorage.removeItem("cine_active_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// FIX 2: ESLint disable comment for the Hook export warning
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
