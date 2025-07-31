import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useAppStore } from "../services/store";

export default function ProfileScreen() {
  const { user } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
    Alert.alert("Info", "Profile editing feature coming soon!");
  };

  const handleUploadPortfolio = () => {
    Alert.alert("Info", "Portfolio upload feature coming soon!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.email}</Text>
        <Text style={styles.role}>
          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} •{" "}
          {user?.subscription_status?.charAt(0).toUpperCase() +
            user?.subscription_status?.slice(1)}{" "}
          Plan
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Subscription:</Text>
          <Text style={styles.infoValue}>
            {user?.subscription_status?.charAt(0).toUpperCase() +
              user?.subscription_status?.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {user?.role === "tailor" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleUploadPortfolio}
          >
            <Text style={styles.actionButtonText}>Upload Portfolio</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  section: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: Colors.gray[800],
    fontWeight: "600",
  },
  actionButton: {
    backgroundColor: Colors.primary[600],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    marginHorizontal: 4,
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
});
