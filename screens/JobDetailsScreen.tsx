import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { Colors } from "../constants/Colors";
import { JOB_STATUS } from "../constants/api";
import { useAppStore } from "../services/store";
import { Job, supabase } from "../services/supabase";

type JobDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "JobDetails"
>;
type JobDetailsScreenRouteProp = RouteProp<RootStackParamList, "JobDetails">;

interface Props {
  navigation: JobDetailsScreenNavigationProp;
  route: JobDetailsScreenRouteProp;
}

export default function JobDetailsScreen({ navigation, route }: Props) {
  const { jobId } = route.params;
  const { user } = useAppStore();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) {
        console.error("Error fetching job details:", error);
        Alert.alert("Error", "Failed to load job details");
        return;
      }

      setJob(data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      Alert.alert("Error", "Failed to load job details");
    } finally {
      setIsLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!user || user.role !== "tailor") return;

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", jobId)
        .eq("tailor_id", user.id)
        .single();

      if (!error && data) {
        setHasApplied(true);
      }
    } catch (error) {
      // No application found, which is fine
    }
  };

  const handleApply = async () => {
    if (!user || user.role !== "tailor") {
      Alert.alert("Error", "Only tailors can apply to jobs");
      return;
    }

    try {
      const { error } = await supabase.from("applications").insert([
        {
          job_id: jobId,
          tailor_id: user.id,
          status: "pending",
        },
      ]);

      if (error) {
        console.error("Error applying to job:", error);
        Alert.alert("Error", "Failed to apply to job");
        return;
      }

      setHasApplied(true);
      Alert.alert("Success", "Application submitted successfully!");
    } catch (error) {
      console.error("Error applying to job:", error);
      Alert.alert("Error", "Failed to apply to job");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: Colors.success[500] }]}
        >
          <Text style={styles.statusText}>
            {job.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{job.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Budget:</Text>
          <Text style={styles.detailValue}>₹{job.budget.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{job.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>{formatDate(job.deadline)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Posted:</Text>
          <Text style={styles.detailValue}>{formatDate(job.created_at)}</Text>
        </View>
      </View>

      {user?.role === "tailor" && job.status === JOB_STATUS.OPEN && (
        <View style={styles.applySection}>
          {hasApplied ? (
            <View style={styles.appliedContainer}>
              <Text style={styles.appliedText}>
                ✅ You have applied to this job
              </Text>
              <Text style={styles.appliedSubtext}>
                The boutique will review your application
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply to Job</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {user?.role === "boutique" && job.posted_by === user.id && (
        <View style={styles.ownerSection}>
          <Text style={styles.ownerText}>This is your job posting</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.error[600],
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
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
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.gray[700],
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: Colors.gray[800],
    fontWeight: "600",
  },
  applySection: {
    margin: 16,
  },
  applyButton: {
    backgroundColor: Colors.primary[600],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  appliedContainer: {
    backgroundColor: Colors.success[50],
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success[200],
    alignItems: "center",
  },
  appliedText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.success[700],
    marginBottom: 4,
  },
  appliedSubtext: {
    fontSize: 14,
    color: Colors.success[600],
  },
  ownerSection: {
    margin: 16,
    backgroundColor: Colors.primary[50],
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  ownerText: {
    fontSize: 14,
    color: Colors.primary[700],
    marginBottom: 12,
    textAlign: "center",
  },
  editButton: {
    backgroundColor: Colors.primary[600],
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
