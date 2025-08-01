import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { Colors } from "../constants/Colors";
import { supabase } from "../services/supabase";
import { useAppStore } from "../services/store";

type PostJobScreenNavigationProp = StackNavigationProp<RootStackParamList, "PostJob">;

interface Props {
  navigation: PostJobScreenNavigationProp;
}

export default function PostJobScreen({ navigation }: Props) {
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget_min: "",
    budget_max: "",
    location: "",
    deadline: "",
    requirements: "",
    job_type: "full_time", // full_time, part_time, contract
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Job title is required");
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Job description is required");
      return false;
    }
    if (!formData.budget_min || !formData.budget_max) {
      Alert.alert("Error", "Budget range is required");
      return false;
    }
    if (parseInt(formData.budget_min) > parseInt(formData.budget_max)) {
      Alert.alert("Error", "Minimum budget cannot be greater than maximum budget");
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert("Error", "Location is required");
      return false;
    }
    if (!formData.deadline) {
      Alert.alert("Error", "Application deadline is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            budget_min: parseInt(formData.budget_min),
            budget_max: parseInt(formData.budget_max),
            location: formData.location.trim(),
            deadline: new Date(formData.deadline).toISOString(),
            requirements: formData.requirements.trim(),
            job_type: formData.job_type,
            status: "open",
            boutique_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      Alert.alert(
        "Success",
        "Job posted successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("MyJobs"),
          },
        ]
      );
    } catch (error) {
      console.error("Error posting job:", error);
      Alert.alert("Error", "Failed to post job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Post a New Job</Text>
        <Text style={styles.subtitle}>
          Create a job posting to find the perfect tailor for your project
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => handleInputChange("title", value)}
            placeholder="e.g., Senior Tailor for Wedding Collection"
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            placeholder="Describe the job requirements, responsibilities, and what you're looking for..."
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Min Budget (₹) *</Text>
            <TextInput
              style={styles.input}
              value={formData.budget_min}
              onChangeText={(value) => handleInputChange("budget_min", value)}
              placeholder="15000"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Max Budget (₹) *</Text>
            <TextInput
              style={styles.input}
              value={formData.budget_max}
              onChangeText={(value) => handleInputChange("budget_max", value)}
              placeholder="25000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(value) => handleInputChange("location", value)}
            placeholder="e.g., Mumbai, Maharashtra"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Application Deadline *</Text>
          <TextInput
            style={styles.input}
            value={formData.deadline}
            onChangeText={(value) => handleInputChange("deadline", value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Type</Text>
          <View style={styles.radioGroup}>
            {[
              { value: "full_time", label: "Full Time" },
              { value: "part_time", label: "Part Time" },
              { value: "contract", label: "Contract" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radioButton,
                  formData.job_type === option.value && styles.radioButtonSelected,
                ]}
                onPress={() => handleInputChange("job_type", option.value)}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    formData.job_type === option.value && styles.radioButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Requirements</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.requirements}
            onChangeText={(value) => handleInputChange("requirements", value)}
            placeholder="Any specific skills, experience, or requirements..."
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Posting..." : "Post Job"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  form: {
    padding: 20,
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
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[700],
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.gray[800],
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
  },
  radioButtonSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  radioButtonText: {
    fontSize: 14,
    color: Colors.gray[700],
    fontWeight: "500",
  },
  radioButtonTextSelected: {
    color: Colors.primary[700],
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: Colors.primary[600],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
}); 