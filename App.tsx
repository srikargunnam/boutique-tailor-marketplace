import 'react-native-url-polyfill/auto';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppRegistry } from "react-native";
import { AuthService } from "./services/auth";
import { useAppStore } from "./services/store";

// Import screens
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import ApplicationsScreen from "./screens/ApplicationsScreen";
import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";
import JobBoardScreen from "./screens/JobBoardScreen";
import JobDetailsScreen from "./screens/JobDetailsScreen";
import LoginScreen from "./screens/LoginScreen";
import MyApplicationsScreen from "./screens/MyApplicationsScreen";
import MyJobsScreen from "./screens/MyJobsScreen";
import PortfolioScreen from "./screens/PortfolioScreen";
import PostJobScreen from "./screens/PostJobScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignupScreen from "./screens/SignupScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  JobBoard: undefined;
  JobDetails: { jobId: string };
  PostJob: undefined;
  MyJobs: undefined;
  Applications: { jobId?: string };
  MyApplications: undefined;
  Portfolio: undefined;
  Profile: undefined;
  Subscription: undefined;
  Chat: { receiverId: string };
  AdminDashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const { user, setUser, isLoading, setLoading } = useAppStore();

  useEffect(() => {
    const checkAuth = async () => {
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
  }, [setUser, setLoading]);

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer>
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
              options={{ title: "Find Jobs" }}
            />
            <Stack.Screen
              name="JobDetails"
              component={JobDetailsScreen}
              options={{ title: "Job Details" }}
            />
            <Stack.Screen
              name="PostJob"
              component={PostJobScreen}
              options={{ title: "Post New Job" }}
            />
            <Stack.Screen
              name="MyJobs"
              component={MyJobsScreen}
              options={{ title: "My Jobs" }}
            />
            <Stack.Screen
              name="Applications"
              component={ApplicationsScreen}
              options={{ title: "Job Applications" }}
            />
            <Stack.Screen
              name="MyApplications"
              component={MyApplicationsScreen}
              options={{ title: "My Applications" }}
            />
            <Stack.Screen
              name="Portfolio"
              component={PortfolioScreen}
              options={{ title: "Portfolio" }}
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
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

// Register the app component
AppRegistry.registerComponent('main', () => App);
