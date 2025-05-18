import { useState, useCallback } from "react";
import { authService } from "@/lib/axios";
import { SignUpData, LoginData, User } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(async (data: SignUpData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signup(data);
      // After signup, login the user
      await authService.login({
        username: data.username,
        password: data.password,
      });
      setUser(authService.getStoredUser());
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(data);
      setUser(authService.getStoredUser());
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
}
