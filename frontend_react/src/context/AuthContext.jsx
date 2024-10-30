import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }

    setLoading(false);
  }, []);

  const setUserToken = (token, refreshToken) => {
    setToken(token);
    setRefreshToken(refreshToken);

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const clearUserToken = () => {
    setToken(null);
    setRefreshToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ token, refreshToken, loading, setUserToken, clearUserToken }}>{children}</AuthContext.Provider>
  );
};
