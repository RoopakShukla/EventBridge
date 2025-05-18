import axios from "axios";
import { SignUpData, LoginData, User, AuthResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isBrowser = typeof window !== "undefined";

export const authService = {
  async signup(data: SignUpData): Promise<User> {
    try {
      const response = await axios.post<User>(`${API_URL}/signup`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    }
  },

  async login(data: LoginData): Promise<void> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
      const { access_token, token_type } = response.data;

      localStorage.setItem("token", access_token);

      const user = await this.getCurrentUser();
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<User>(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to get user data"
      );
    }
  },

  logout(): void {
    if (isBrowser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  isAuthenticated(): boolean {
    if (!isBrowser) return false;
    return !!localStorage.getItem("token");
  },

  getStoredUser(): User | null {
    if (!isBrowser) return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAdmin(): boolean {
    if (!isBrowser) return false;
    const userStr = localStorage.getItem("user");
    const is_admin = userStr ? JSON.parse(userStr)?.is_admin : false;
    return is_admin;
  },
};

export const eventsService = {
  async getEvents({ is_admin }: { is_admin: boolean }): Promise<any> {
    try {
      if (is_admin) {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/events/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } else {
        const response = await axios.get(`${API_URL}/events`);
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch events");
    }
  },

  async getEventById(id: string): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch event details"
      );
    }
  },

  async createEvent(data: any): Promise<any> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/events`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to create event");
    }
  },
};
