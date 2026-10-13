import { create } from "zustand";

export const useAdminStore = create((set) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,

  setAdmin: (admin, accessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hn_admin_token", accessToken);
      localStorage.setItem("hn_admin_user", JSON.stringify(admin));
    }
    set({ admin, accessToken, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hn_admin_token");
      localStorage.removeItem("hn_admin_user");
    }
    set({ admin: null, accessToken: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("hn_admin_token");
    const userStr = localStorage.getItem("hn_admin_user");
    if (token && userStr) {
      try {
        const admin = JSON.parse(userStr);
        set({ admin, accessToken: token, isAuthenticated: true });
      } catch {
        localStorage.removeItem("hn_admin_token");
        localStorage.removeItem("hn_admin_user");
      }
    }
  },
}));
