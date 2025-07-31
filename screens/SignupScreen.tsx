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

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"boutique" | "tailor">("boutique");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAppStore();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await AuthService.signUp(email, password, role);

      if (error) {
        Alert.alert("Signup Failed", error.message);
        return;
      }

      if (data.user) {
        const user = await AuthService.getCurrentUser();
        setUser(user);
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email for verification."
        );
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
            Join Us
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: Colors.gray[600],
              textAlign: "center",
            }}
          >
            Create your Boutique Tailor Marketplace account
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
            Sign Up
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

          <View style={{ marginBottom: 16 }}>
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

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 8,
                color: Colors.gray[700],
              }}
            >
              Confirm Password
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
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
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
              I am a:
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor:
                    role === "boutique"
                      ? Colors.primary[600]
                      : Colors.gray[300],
                  backgroundColor:
                    role === "boutique" ? Colors.primary[50] : Colors.gray[50],
                  alignItems: "center",
                }}
                onPress={() => setRole("boutique")}
              >
                <Text
                  style={{
                    color:
                      role === "boutique"
                        ? Colors.primary[600]
                        : Colors.gray[600],
                    fontWeight: "600",
                  }}
                >
                  Boutique
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor:
                    role === "tailor" ? Colors.primary[600] : Colors.gray[300],
                  backgroundColor:
                    role === "tailor" ? Colors.primary[50] : Colors.gray[50],
                  alignItems: "center",
                }}
                onPress={() => setRole("tailor")}
              >
                <Text
                  style={{
                    color:
                      role === "tailor"
                        ? Colors.primary[600]
                        : Colors.gray[600],
                    fontWeight: "600",
                  }}
                >
                  Tailor
                </Text>
              </TouchableOpacity>
            </View>
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
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text style={{ color: Colors.gray[600], fontSize: 14 }}>
              Already have an account?{" "}
              <Text
                style={{ color: Colors.primary[600], fontWeight: "600" }}
                onPress={() => navigation.navigate("Login")}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
