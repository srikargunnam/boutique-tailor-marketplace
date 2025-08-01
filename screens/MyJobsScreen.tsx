import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { Colors } from "../constants/Colors";
import { supabase } from "../services/supabase";
import { useAppStore } from "../services/store";

type MyJobsScreenNavigationProp = StackNavigationProp<RootStackParamList, "MyJobs">;

interface Props {
  navigation: MyJobsScreenNavigationProp;
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  location: string;
  deadline: string;
  status: string;
  job_type: string;
  created_at: string;
  applications_count?: number;
}

export default function MyJobsScreen({ navigation }: Props) {
  const { user } = useAppStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          applications:job_applications(count)
        `)
        .eq("boutique_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const jobsWithCounts = data?.map(job => ({
        ...job,
        applications_count: job.applications?.[0]?.count || 0,
      })) || [];

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert("Error", "Failed to load your jobs");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) throw error;

      // Update local state
      setJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );

      Alert.alert("Success", `Job status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating job status:", error);
      Alert.alert("Error", "Failed to update job status");
    }
  };

  const handleViewApplications = (jobId: string) => {
    navigation.navigate("Applications", { jobId });
  };

  const handleEditJob = (jobId: string) => {
    // TODO: Implement edit job functionality
    Alert.alert("Coming Soon", "Edit job functionality will be available soon!");
  };

  const handleDeleteJob = (jobId: string) => {
    Alert.alert(
      "Delete Job",
      "Are you sure you want to delete this job? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("jobs")
                .delete()
                .eq("id", jobId);

              if (error) throw error;

              setJobs(prev => prev.filter(job => job.id !== jobId));
              Alert.alert("Success", "Job deleted successfully");
            } catch (error) {
              console.error("Error deleting job:", error);
              Alert.alert("Error", "Failed to delete job");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return Colors.success[500];
      case "in_progress":
        return Colors.warning[500];
      case "completed":
        return Colors.primary[500];
      case "cancelled":
        return Colors.error[500];
      default:
        return Colors.gray[500];
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Budget:</Text>
          <Text style={styles.detailValue}>₹{item.budget_min.toLocaleString()} - ₹{item.budget_max.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{item.job_type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Applications:</Text>
          <Text style={styles.detailValue}>{item.applications_count}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => handleViewApplications(item.id)}
        >
          <Text style={styles.primaryButtonText}>View Applications</Text>
        </TouchableOpacity>

        {item.status === "open" && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleEditJob(item.id)}
            >
              <Text style={styles.secondaryButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => handleDeleteJob(item.id)}
            >
              <Text style={styles.dangerButtonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}

        {item.status === "open" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.warningButton]}
            onPress={() => handleStatusChange(item.id, "in_progress")}
          >
            <Text style={styles.warningButtonText}>Start Work</Text>
          </TouchableOpacity>
        )}

        {item.status === "in_progress" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.successButton]}
            onPress={() => handleStatusChange(item.id, "completed")}
          >
            <Text style={styles.successButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading your jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <TouchableOpacity
          style={styles.postJobButton}
          onPress={() => navigation.navigate("PostJob")}
        >
          <Text style={styles.postJobButtonText}>+ Post New Job</Text>
        </TouchableOpacity>
      </View>

      {jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No jobs posted yet</Text>
          <Text style={styles.emptySubtitle}>
            Start by posting your first job to find talented tailors
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("PostJob")}
          >
            <Text style={styles.emptyButtonText}>Post Your First Job</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray[800],
  },
  postJobButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  postJobButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  jobDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  jobDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
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
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Colors.primary[600],
  },
  primaryButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.gray[200],
  },
  secondaryButtonText: {
    color: Colors.gray[700],
    fontSize: 12,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: Colors.error[100],
  },
  dangerButtonText: {
    color: Colors.error[600],
    fontSize: 12,
    fontWeight: "600",
  },
  warningButton: {
    backgroundColor: Colors.warning[100],
  },
  warningButtonText: {
    color: Colors.warning[700],
    fontSize: 12,
    fontWeight: "600",
  },
  successButton: {
    backgroundColor: Colors.success[100],
  },
  successButtonText: {
    color: Colors.success[700],
    fontSize: 12,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
}); 