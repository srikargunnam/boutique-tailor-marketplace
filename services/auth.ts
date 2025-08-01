import { supabase } from "./supabase";

export interface AuthUser {
  id: string;
  email: string;
  role: "boutique" | "tailor" | "admin";
  subscription_status: "free" | "basic" | "premium";
}

export class AuthService {
  static async signUp(
    email: string,
    password: string,
    role: "boutique" | "tailor"
  ) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            subscription_status: "free",
          },
        },
      });

      if (error) throw error;

      // Note: Profile creation will be handled by database trigger
      // or we'll create it when the user first logs in
      console.log("User signed up successfully:", data.user?.id);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      return profile as AuthUser;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static async updateUserRole(
    userId: string,
    role: "boutique" | "tailor" | "admin"
  ) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async updateSubscriptionStatus(
    userId: string,
    status: "free" | "basic" | "premium"
  ) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ subscription_status: status })
        .eq("id", userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}
