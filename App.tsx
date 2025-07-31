import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthService } from "./services/auth";
import { useAppStore } from "./services/store";

// Import screens
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";
import JobBoardScreen from "./screens/JobBoardScreen";
import JobDetailsScreen from "./screens/JobDetailsScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignupScreen from "./screens/SignupScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  JobBoard: undefined;
  JobDetails: { jobId: string };
  Profile: undefined;
  Subscription: undefined;
  Chat: { receiverId: string };
  AdminDashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const { user, setUser, setLoading } = useAppStore();

  useEffect(() => {
    // Check for existing session on app start
    const checkAuth = async () => {
      setLoading(true);
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#0ea5e9",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          {!user ? (
            // Auth screens
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            // Main app screens
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Boutique Tailor Marketplace" }}
              />
              <Stack.Screen
                name="JobBoard"
                component={JobBoardScreen}
                options={{ title: "Job Board" }}
              />
              <Stack.Screen
                name="JobDetails"
                component={JobDetailsScreen}
                options={{ title: "Job Details" }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Profile" }}
              />
              <Stack.Screen
                name="Subscription"
                component={SubscriptionScreen}
                options={{ title: "Subscription Plans" }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: "Chat" }}
              />
              {user.role === "admin" && (
                <Stack.Screen
                  name="AdminDashboard"
                  component={AdminDashboardScreen}
                  options={{ title: "Admin Dashboard" }}
                />
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
