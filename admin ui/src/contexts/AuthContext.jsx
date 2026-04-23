// import { createContext, useState } from "react";
// import { authApi } from "../services/authApi";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (email, password) => {
//     try {
//       const response = await authApi.login(email, password);
      
//       // LOG THE FULL RESPONSE TO SEE STRUCTURE
//       console.log('📦 Full response in AuthContext:', response);
      
//       // The token is nested inside response.data.data.token
//       // Based on your console output, it's: response.data.token
//       // Wait, let me check your console output carefully...
      
//       // From your console: 
//       // ✅ Login successful: 
//       // Object
//       // data: 
//       //   token: "eyJhbGciOiJIUzI1NiIs..."
//       //   user: {id: 1, full_name: 'System Admin', ...}
      
//       // So the structure is: response.data.token (not response.data.data.token)
//       const token = response.data?.token || response.token;
//       const userData = response.data?.user || response.user;
      
//       console.log('🔑 Extracted token:', token ? 'Present' : 'Missing');
//       console.log('👤 Extracted user:', userData);
      
//       // Save token
//       localStorage.setItem("token", token);
      
//       setUser(userData);

//       return { success: true };
//     } catch (error) {
//       console.error('❌ Login error in AuthContext:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { authApi } from "../services/authApi";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // admin | herb-creator
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("herbisense_user");
      const token = localStorage.getItem("herbisense_token");
      const savedUserType = localStorage.getItem("userType");

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        setUserType(savedUserType);
      } else {
        clearStorage();
      }
    } catch (error) {
      console.error("Error loading user:", error);
      clearStorage();
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Clear storage helper
  const clearStorage = () => {
    localStorage.removeItem("herbisense_user");
    localStorage.removeItem("herbisense_token");
    localStorage.removeItem("userType");
    localStorage.removeItem("token");
  };

  // ✅ LOGIN FUNCTION (UPDATED 🔥)
  const login = async (email, password, type = "admin") => {
    try {
      const response = await authApi.login(email, password);

      const token = response.data?.token || response.token;
      const userData = response.data?.user || response.user;

      if (!token || !userData) {
        throw new Error("Invalid response from server");
      }

      // 🔥 IMPORTANT: Force role mapping
      const role = type === "creator" ? "herb-creator" : "admin";

      // ✅ Save to localStorage
      localStorage.setItem("herbisense_token", token);
      localStorage.setItem("herbisense_user", JSON.stringify(userData));
      localStorage.setItem("userType", role);
      localStorage.setItem("token", token);

      // ✅ Update state
      setUser(userData);
      setUserType(role);

      return { success: true, role };

    } catch (error) {
      console.error("❌ Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    clearStorage();
    setUser(null);
    setUserType(null);
  };

  // ✅ ROLE HELPERS (UPDATED)
  const isAdmin = () => userType === "admin";
  const isHerbCreator = () => userType === "herb-creator";

  // ✅ PERMISSION HELPERS (NEW 🔥)
  const canAccessDashboard = () =>
    userType === "admin" || userType === "herb-creator";

  const canAccessHerbs = () =>
    userType === "admin" || userType === "herb-creator";

  const canPublishHerb = () =>
    userType === "admin"; // 🚫 creator cannot publish

  const canManageUsers = () =>
    userType === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        login,
        logout,
        loading,

        // helpers
        isAdmin,
        isHerbCreator,

        // permissions
        canAccessDashboard,
        canAccessHerbs,
        canPublishHerb,
        canManageUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};