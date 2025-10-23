import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  user: string | null;
  token: string | null;
  query: string;
  showSearch: boolean;
  setUser: (user: string | null) => void;
  setToken: (token: string | null) => void;
  setQuery: (query: string) => void;
  setShowSearch: (showSearch: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null, // Token is now managed server-side via httpOnly cookies
      query: "",
      showSearch: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setQuery: (query) => set({ query }),
      setShowSearch: (showSearch) => set({ showSearch }),
    }),
    { name: "app-store" } // Saves to localStorage
  )
);
