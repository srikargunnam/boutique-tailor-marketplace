import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Please check your environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  role: "boutique" | "tailor" | "admin";
  subscription_status: "free" | "basic" | "premium";
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  deadline: string;
  posted_by: string;
  status: "open" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  tailor_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface Rating {
  id: string;
  from_id: string;
  to_id: string;
  score: number;
  comment: string;
  created_at: string;
}
