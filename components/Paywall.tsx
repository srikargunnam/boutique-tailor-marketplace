import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import { SUBSCRIPTION_PLANS } from "../constants/api";

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
  title?: string;
  message?: string;
}

export default function Paywall({
  visible,
  onClose,
  onSubscribe,
  title = "Upgrade Your Plan",
  message = "Get access to premium features and unlock your full potential",
}: PaywallProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          <View style={styles.plansContainer}>
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
                onPress={() => onSubscribe(plan.id)}
              >
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
                  style={styles.subscribeButton}
                  onPress={() => onSubscribe(plan.id)}
                >
                  <Text style={styles.subscribeText}>Subscribe Now</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: "center",
    lineHeight: 22,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.primary[200],
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
  subscribeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    padding: 16,
    alignItems: "center",
  },
  closeText: {
    color: Colors.gray[500],
    fontSize: 16,
    fontWeight: "500",
  },
});
