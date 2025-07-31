import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { Colors } from "../constants/Colors";
import { AuthService } from "../services/auth";
import { useAppStore } from "../services/store";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAppStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await AuthService.signIn(email, password);

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

      if (data.user) {
        const user = await AuthService.getCurrentUser();
        setUser(user);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
          backgroundColor: Colors.gray[50],
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: Colors.primary[600],
              marginBottom: 10,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: Colors.gray[600],
              textAlign: "center",
            }}
          >
            Sign in to your Boutique Tailor Marketplace account
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 20,
              color: Colors.gray[800],
            }}
          >
            Login
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 8,
                color: Colors.gray[700],
              }}
            >
              Email
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: Colors.gray[300],
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: Colors.gray[50],
              }}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 8,
                color: Colors.gray[700],
              }}
            >
              Password
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: Colors.gray[300],
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: Colors.gray[50],
              }}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary[600],
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 16,
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text style={{ color: Colors.gray[600], fontSize: 14 }}>
              Don't have an account?{" "}
              <Text
                style={{ color: Colors.primary[600], fontWeight: "600" }}
                onPress={() => navigation.navigate("Signup")}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
