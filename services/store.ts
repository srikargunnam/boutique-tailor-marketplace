import { create } from "zustand";
import { AuthUser } from "./auth";
import { Application, Job, Message } from "./supabase";

interface AppState {
  // Auth state
  user: AuthUser | null;
  isLoading: boolean;

  // Jobs state
  jobs: Job[];
  selectedJob: Job | null;

  // Applications state
  applications: Application[];

  // Messages state
  messages: Message[];

  // UI state
  isPaywallVisible: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setJobs: (jobs: Job[]) => void;
  setSelectedJob: (job: Job | null) => void;
  setApplications: (applications: Application[]) => void;
  setMessages: (messages: Message[]) => void;
  setPaywallVisible: (visible: boolean) => void;

  // Computed values
  isSubscribed: () => boolean;
  canAccessJobDetails: () => boolean;
  canSendMessages: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  jobs: [],
  selectedJob: null,
  applications: [],
  messages: [],
  isPaywallVisible: false,

  // Actions
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setJobs: (jobs) => set({ jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setApplications: (applications) => set({ applications }),
  setMessages: (messages) => set({ messages }),
  setPaywallVisible: (visible) => set({ isPaywallVisible: visible }),

  // Computed values
  isSubscribed: () => {
    const { user } = get();
    return (
      user?.subscription_status === "basic" ||
      user?.subscription_status === "premium"
    );
  },

  canAccessJobDetails: () => {
    const { user } = get();
    return (
      user?.subscription_status === "basic" ||
      user?.subscription_status === "premium"
    );
  },

  canSendMessages: () => {
    const { user } = get();
    return (
      user?.subscription_status === "basic" ||
      user?.subscription_status === "premium"
    );
  },
}));
