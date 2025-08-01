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

type ApplicationsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Applications">;

interface Props {
  navigation: ApplicationsScreenNavigationProp;
  route: {
    params?: {
      jobId?: string;
    };
  };
}

interface Application {
  id: string;
  job_id: string;
  tailor_id: string;
  cover_letter: string;
  proposed_budget: number;
  status: string;
  created_at: string;
  job: {
    title: string;
    budget_min: number;
    budget_max: number;
  };
  tailor: {
    email: string;
    profile: {
      full_name?: string;
      phone?: string;
      experience_years?: number;
      specializations?: string[];
    };
  };
}

export default function ApplicationsScreen({ navigation, route }: Props) {
  const { user } = useAppStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("all"); // all, pending, accepted, rejected

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from("job_applications")
        .select(`
          *,
          job:jobs(title, budget_min, budget_max),
          tailor:users!job_applications_tailor_id_fkey(
            email,
            profile:user_profiles(*)
          )
        `)
        .eq("job.boutique_id", user?.id);

      if (route.params?.jobId) {
        query = query.eq("job_id", route.params.jobId);
      }

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      Alert.alert("Error", "Failed to load applications");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      Alert.alert("Success", `Application ${newStatus}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      Alert.alert("Error", "Failed to update application status");
    }
  };

  const handleMessageTailor = (tailorId: string, tailorName: string) => {
    navigation.navigate("Chat", { receiverId: tailorId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return Colors.warning[500];
      case "accepted":
        return Colors.success[500];
      case "rejected":
        return Colors.error[500];
      default:
        return Colors.gray[500];
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderApplicationItem = ({ item }: { item: Application }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <Text style={styles.jobTitle}>{item.job.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.tailorInfo}>
        <Text style={styles.tailorName}>
          {item.tailor.profile?.full_name || item.tailor.email}
        </Text>
        <Text style={styles.tailorEmail}>{item.tailor.email}</Text>
        {item.tailor.profile?.phone && (
          <Text style={styles.tailorPhone}>{item.tailor.profile.phone}</Text>
        )}
        {item.tailor.profile?.experience_years && (
          <Text style={styles.tailorExperience}>
            {item.tailor.profile.experience_years} years of experience
          </Text>
        )}
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Proposed Budget:</Text>
          <Text style={styles.detailValue}>₹{item.proposed_budget.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Job Budget Range:</Text>
          <Text style={styles.detailValue}>
            ₹{item.job.budget_min.toLocaleString()} - ₹{item.job.budget_max.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Applied:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.coverLetter}>
        <Text style={styles.coverLetterTitle}>Cover Letter:</Text>
        <Text style={styles.coverLetterText} numberOfLines={3}>
          {item.cover_letter}
        </Text>
      </View>

      {item.tailor.profile?.specializations && item.tailor.profile.specializations.length > 0 && (
        <View style={styles.specializations}>
          <Text style={styles.specializationsTitle}>Specializations:</Text>
          <View style={styles.specializationTags}>
            {item.tailor.profile.specializations.map((spec, index) => (
              <View key={index} style={styles.specializationTag}>
                <Text style={styles.specializationText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.actionButtons}>
        {item.status === "pending" && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleStatusUpdate(item.id, "accepted")}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleStatusUpdate(item.id, "rejected")}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => handleMessageTailor(item.tailor_id, item.tailor.profile?.full_name || item.tailor.email)}
        >
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {[
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "accepted", label: "Accepted" },
        { key: "rejected", label: "Rejected" },
      ].map((filterOption) => (
        <TouchableOpacity
          key={filterOption.key}
          style={[
            styles.filterButton,
            filter === filterOption.key && styles.filterButtonActive,
          ]}
          onPress={() => setFilter(filterOption.key)}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === filterOption.key && styles.filterButtonTextActive,
            ]}
          >
            {filterOption.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading applications...</Text>
      </View>
    );
  }

  const filteredApplications = applications.filter(app => 
    filter === "all" || app.status === filter
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {route.params?.jobId ? "Job Applications" : "All Applications"}
        </Text>
      </View>

      {renderFilterButtons()}

      {filteredApplications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No applications found</Text>
          <Text style={styles.emptySubtitle}>
            {filter === "all" 
              ? "Applications will appear here when tailors apply to your jobs"
              : `No ${filter} applications found`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredApplications}
          renderItem={renderApplicationItem}
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
  filterContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: Colors.gray[100],
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray[700],
  },
  filterButtonTextActive: {
    color: "white",
  },
  listContainer: {
    padding: 20,
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
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
  tailorInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  tailorName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  tailorEmail: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  tailorPhone: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  tailorExperience: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  applicationDetails: {
    marginBottom: 12,
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
  coverLetter: {
    marginBottom: 12,
  },
  coverLetterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray[700],
    marginBottom: 4,
  },
  coverLetterText: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
  },
  specializations: {
    marginBottom: 12,
  },
  specializationsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray[700],
    marginBottom: 4,
  },
  specializationTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specializationTag: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specializationText: {
    fontSize: 12,
    color: Colors.primary[700],
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: Colors.success[600],
  },
  acceptButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  rejectButton: {
    backgroundColor: Colors.error[600],
  },
  rejectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  messageButton: {
    backgroundColor: Colors.primary[600],
  },
  messageButtonText: {
    color: "white",
    fontSize: 14,
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
  },
}); 