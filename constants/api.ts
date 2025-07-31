export const API_CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
};

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: "basic_monthly",
    name: "Basic Plan",
    price: 500, // ₹500
    currency: "INR",
    features: [
      "Access to job details",
      "Apply to jobs",
      "Basic messaging",
      "Profile visibility",
    ],
  },
  PREMIUM: {
    id: "premium_monthly",
    name: "Premium Plan",
    price: 1500, // ₹1,500
    currency: "INR",
    features: [
      "All Basic features",
      "Priority job listings",
      "Advanced messaging",
      "Portfolio showcase",
      "Analytics dashboard",
    ],
  },
};

export const JOB_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export const APPLICATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export const USER_ROLES = {
  BOUTIQUE: "boutique",
  TAILOR: "tailor",
  ADMIN: "admin",
} as const;

export const SUBSCRIPTION_STATUS = {
  FREE: "free",
  BASIC: "basic",
  PREMIUM: "premium",
} as const;
