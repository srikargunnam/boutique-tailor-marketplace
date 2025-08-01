import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { Colors } from "../constants/Colors";
import { AuthService } from "../services/auth";
import { useAppStore } from "../services/store";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { user, setUser } = useAppStore();

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Profile",
        description: "Manage your profile and settings",
        icon: "👤",
        onPress: () => navigation.navigate("Profile"),
        color: Colors.secondary[500],
      },
      {
        title: "Subscription",
        description: "Upgrade your plan for more features",
        icon: "⭐",
        onPress: () => navigation.navigate("Subscription"),
        color: Colors.warning[500],
      },
      {
        title: "Chat",
        description: "Message with other users",
        icon: "💬",
        onPress: () => navigation.navigate("Chat", { receiverId: "" }),
        color: Colors.success[500],
      },
    ];

    if (user?.role === "boutique") {
      return [
        {
          title: "Post Job",
          description: "Create a new job posting",
          icon: "📝",
          onPress: () => navigation.navigate("PostJob"),
          color: Colors.primary[500],
        },
        {
          title: "My Jobs",
          description: "Manage your posted jobs",
          icon: "📋",
          onPress: () => navigation.navigate("MyJobs"),
          color: Colors.primary[600],
        },
        {
          title: "Applications",
          description: "Review job applications",
          icon: "📄",
          onPress: () => navigation.navigate("Applications"),
          color: Colors.secondary[600],
        },
        ...baseItems,
      ];
    } else if (user?.role === "tailor") {
      return [
        {
          title: "Find Jobs",
          description: "Browse and search for jobs",
          icon: "🔍",
          onPress: () => navigation.navigate("JobBoard"),
          color: Colors.primary[500],
        },
        {
          title: "My Applications",
          description: "Track your job applications",
          icon: "📝",
          onPress: () => navigation.navigate("MyApplications"),
          color: Colors.secondary[500],
        },
        {
          title: "Portfolio",
          description: "Showcase your work",
          icon: "🎨",
          onPress: () => navigation.navigate("Portfolio"),
          color: Colors.success[500],
        },
        ...baseItems,
      ];
    }

    // Default items for unknown roles
    return [
      {
        title: "Job Board",
        description: "Browse and apply to jobs",
        icon: "💼",
        onPress: () => navigation.navigate("JobBoard"),
        color: Colors.primary[500],
      },
      ...baseItems,
    ];
  };

  const menuItems = getMenuItems();

  // Add admin dashboard for admin users
  if (user?.role === "admin") {
    menuItems.push({
      title: "Admin Dashboard",
      description: "Manage users and monitor system",
      icon: "⚙️",
      onPress: () => navigation.navigate("AdminDashboard"),
      color: Colors.error[500],
    });
  }

  // Role-based stats
  const getStats = () => {
    if (user?.role === "boutique") {
      return [
        { number: "0", label: "Active Jobs" },
        { number: "0", label: "Applications" },
        { number: "0", label: "Messages" },
      ];
    } else if (user?.role === "tailor") {
      return [
        { number: "0", label: "Applications" },
        { number: "0", label: "Interviews" },
        { number: "0", label: "Messages" },
      ];
    }
    return [
      { number: "0", label: "Active Jobs" },
      { number: "0", label: "Applications" },
      { number: "0", label: "Messages" },
    ];
  };

  const stats = getStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.email?.split("@")[0]}!
        </Text>
        <Text style={styles.roleText}>
          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} •{" "}
          {user?.subscription_status?.charAt(0).toUpperCase() +
            user?.subscription_status?.slice(1)}{" "}
          Plan
        </Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderLeftColor: item.color }]}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  menuGrid: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  statsContainer: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary[600],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray[600],
    textAlign: "center",
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.error[500],
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
