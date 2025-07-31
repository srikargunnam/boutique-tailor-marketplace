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
import { SUBSCRIPTION_PLANS } from "../constants/api";
import { useAppStore } from "../services/store";

export default function SubscriptionScreen() {
  const { user } = useAppStore();

  const handleSubscribe = (planId: string) => {
    Alert.alert("Info", `Razorpay integration for ${planId} coming soon!`);
  };

  const handleCancelSubscription = () => {
    Alert.alert("Info", "Subscription cancellation feature coming soon!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Unlock premium features and grow your business
        </Text>
      </View>

      <View style={styles.currentPlan}>
        <Text style={styles.currentPlanTitle}>Current Plan</Text>
        <Text style={styles.currentPlanName}>
          {user?.subscription_status?.charAt(0).toUpperCase() +
            user?.subscription_status?.slice(1)}{" "}
          Plan
        </Text>
        {user?.subscription_status !== "free" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.plansContainer}>
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                ₹{plan.price.toLocaleString()}/month
              </Text>
            </View>

            <View style={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                user?.subscription_status === plan.id.split("_")[0] &&
                  styles.currentPlanButton,
              ]}
              onPress={() => handleSubscribe(plan.id)}
              disabled={user?.subscription_status === plan.id.split("_")[0]}
            >
              <Text style={styles.subscribeButtonText}>
                {user?.subscription_status === plan.id.split("_")[0]
                  ? "Current Plan"
                  : "Subscribe Now"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Why Subscribe?</Text>
        <Text style={styles.infoText}>
          • Access to detailed job descriptions and contact information{"\n"}•
          Apply to unlimited job opportunities{"\n"}• Priority listing in search
          results{"\n"}• Advanced messaging features{"\n"}• Portfolio showcase
          for tailors{"\n"}• Analytics and insights
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
  currentPlan: {
    backgroundColor: Colors.primary[50],
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  currentPlanTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary[700],
    marginBottom: 8,
  },
  currentPlanName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary[800],
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: Colors.error[500],
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  plansContainer: {
    padding: 16,
  },
  planCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary[600],
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIcon: {
    color: Colors.success[500],
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.gray[700],
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: Colors.primary[600],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  currentPlanButton: {
    backgroundColor: Colors.gray[400],
  },
  subscribeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
