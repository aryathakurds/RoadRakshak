import { useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  signupUser,
} from "../services/authApi";
import {
  SESSION_EXPIRED_EVENT,
  TOKEN_KEY,
} from "../services/apiClient";

export function useAuth() {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || "";
  });

  const [authLoading, setAuthLoading] = useState(
    Boolean(token)
  );

  const [sessionExpired, setSessionExpired] =
    useState(false);

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
    setAuthLoading(false);
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      clearSession();
      setSessionExpired(true);
    };

    window.addEventListener(
      SESSION_EXPIRED_EVENT,
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        SESSION_EXPIRED_EVENT,
        handleSessionExpired
      );
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }

    let isActive = true;

    const verifyUser = async () => {
      try {
        setAuthLoading(true);

        const data = await getCurrentUser(token);

        if (isActive) {
          setUser(data.user);
        }
      } catch {
        if (isActive) {
          clearSession();
        }
      } finally {
        if (isActive) {
          setAuthLoading(false);
        }
      }
    };

    verifyUser();

    return () => {
      isActive = false;
    };
  }, [token]);

  const saveSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setSessionExpired(false);
  };

  const signup = async (form) => {
    const data = await signupUser(form);
    saveSession(data);
    return data;
  };

  const login = async (form) => {
    const data = await loginUser(form);
    saveSession(data);
    return data;
  };

  const logout = () => {
    clearSession();
    setSessionExpired(false);
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  return {
    user,
    token,
    authLoading,
    sessionExpired,
    signup,
    login,
    logout,
    clearSessionExpired,
  };
}