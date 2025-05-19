import axios from "axios";
import localforage from "localforage";
import { SignUpData, LoginData, User, AuthResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isBrowser = typeof window !== "undefined";

// Initialize localforage
localforage.config({
  name: 'community-pulse',
  storeName: 'auth_store'
});

export const authService = {
  async signup(data: SignUpData): Promise<User> {
    try {
      const response = await axios.post<User>(`${API_URL}/signup/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    }
  },

  async login(data: LoginData): Promise<void> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/login/`, data);
      const { access_token, token_type } = response.data;

      await localforage.setItem("token", access_token);

      const user = await this.getCurrentUser();
      await localforage.setItem("user", user);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const token = await localforage.getItem<string>("token");
      const response = await axios.get<User>(`${API_URL}/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to get user data");
    }
  },

  async logout(): Promise<void> {
    if (isBrowser) {
      await localforage.removeItem("token");
      await localforage.removeItem("user");
    }
  },

  async isAuthenticated(): Promise<boolean> {
    if (!isBrowser) return false;
    const token = await localforage.getItem<string>("token");
    return !!token;
  },

  async getStoredUser(): Promise<User | null> {
    if (!isBrowser) return null;
    return await localforage.getItem<User>("user");
  },

  async isAdmin(): Promise<boolean> {
    if (!isBrowser) return false;
    const user = await localforage.getItem<User>("user");
    return !!user?.is_admin;
  },
};

export const eventsService = {
  async getEvents(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/events/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch events");
    }
  },

  async getAdminEvents(): Promise<any> {
    try {
      const token = await localforage.getItem<string>("token");
      const response = await axios.get(`${API_URL}/events/all/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch admin events");
    }
  },

  async getEventById(id: string): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/events/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch event details"
      );
    }
  },

  async createEvent(data: any): Promise<any> {
    try {
      const token = await localforage.getItem<string>("token");
      const response = await axios.post(`${API_URL}/events/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to create event");
    }
  },

  async approveEvent(id: string): Promise<any> {
    try {
      const token = await localforage.getItem<string>("token");
      const response = await axios.post(
        `${API_URL}/admin/events/${id}/approve/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to approve event"
      );
    }
  },

  async rejectEvent(id: string): Promise<any> {
    try {
      const token = await localforage.getItem<string>("token");
      const response = await axios.post(
        `${API_URL}/admin/events/${id}/reject/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to reject event");
    }
  },

  async registerForEvent(id: string): Promise<any> {
    try {
      const token = await localforage.getItem<string>("token");
      const response = await axios.post(
        `${API_URL}/events/${id}/register/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to register for event"
      );
    }
  },
};
