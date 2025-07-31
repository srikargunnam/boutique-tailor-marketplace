import { RouteProp } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../App";
import { Colors } from "../constants/Colors";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

interface Props {
  route: ChatScreenRouteProp;
}

export default function ChatScreen({ route }: Props) {
  const { receiverId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>💬</Text>
        <Text style={styles.placeholderTitle}>Chat Feature</Text>
        <Text style={styles.placeholderSubtitle}>
          Real-time messaging with Supabase Realtime coming soon!
        </Text>
        <Text style={styles.placeholderDetails}>
          • Send and receive messages{"\n"}• Real-time notifications{"\n"}• File
          and image sharing{"\n"}• Message history
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    margin: 20,
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 12,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  placeholderDetails: {
    fontSize: 14,
    color: Colors.gray[700],
    textAlign: "center",
    lineHeight: 20,
  },
});
