import React from "react";
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

export default function AdminDashboardScreen() {
  const { user } = useAppStore();

  const handleUserVerification = () => {
    Alert.alert("Info", "User verification feature coming soon!");
  };

  const handleDisputeResolution = () => {
    Alert.alert("Info", "Dispute resolution feature coming soon!");
  };

  const handleSubscriptionMonitoring = () => {
    Alert.alert("Info", "Subscription monitoring feature coming soon!");
  };

  const handleSystemAnalytics = () => {
    Alert.alert("Info", "System analytics feature coming soon!");
  };

  const adminFeatures = [
    {
      title: "User Verification",
      description: "Verify and approve new user accounts",
      icon: "👥",
      onPress: handleUserVerification,
      color: Colors.primary[500],
    },
    {
      title: "Dispute Resolution",
      description: "Handle conflicts between users",
      icon: "⚖️",
      onPress: handleDisputeResolution,
      color: Colors.warning[500],
    },
    {
      title: "Subscription Monitoring",
      description: "Track subscription status and payments",
      icon: "💰",
      onPress: handleSubscriptionMonitoring,
      color: Colors.success[500],
    },
    {
      title: "System Analytics",
      description: "View platform usage and statistics",
      icon: "📊",
      onPress: handleSystemAnalytics,
      color: Colors.secondary[500],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          Manage the Boutique Tailor Marketplace platform
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Platform Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Subscriptions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Admin Actions</Text>
        {adminFeatures.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.featureCard, { borderLeftColor: feature.color }]}
            onPress={feature.onPress}
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Admin Guidelines</Text>
        <Text style={styles.infoText}>
          • Verify new user accounts within 24 hours{"\n"}• Respond to disputes
          within 48 hours{"\n"}• Monitor subscription payments daily{"\n"}•
          Review platform analytics weekly{"\n"}• Maintain user privacy and data
          security
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: "center",
  },
  statsContainer: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    backgroundColor: Colors.gray[50],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
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
  featuresContainer: {
    padding: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 16,
  },
  featureCard: {
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
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  infoSection: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray[700],
    lineHeight: 20,
  },
});
