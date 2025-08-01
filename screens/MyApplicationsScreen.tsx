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

type MyApplicationsScreenNavigationProp = StackNavigationProp<RootStackParamList, "MyApplications">;

interface Props {
  navigation: MyApplicationsScreenNavigationProp;
}

interface Application {
  id: string;
  job_id: string;
  cover_letter: string;
  proposed_budget: number;
  status: string;
  created_at: string;
  job: {
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    location: string;
    deadline: string;
    job_type: string;
    boutique: {
      email: string;
      profile: {
        full_name?: string;
        phone?: string;
      };
    };
  };
}

export default function MyApplicationsScreen({ navigation }: Props) {
  const { user } = useAppStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("all"); // all, pending, accepted, rejected

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          job:jobs(
            title,
            description,
            budget_min,
            budget_max,
            location,
            deadline,
            job_type,
            boutique:users!jobs_boutique_id_fkey(
              email,
              profile:user_profiles(*)
            )
          )
        `)
        .eq("tailor_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      Alert.alert("Error", "Failed to load your applications");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const handleMessageBoutique = (boutiqueId: string, boutiqueName: string) => {
    navigation.navigate("Chat", { receiverId: boutiqueId });
  };

  const handleWithdrawApplication = (applicationId: string) => {
    Alert.alert(
      "Withdraw Application",
      "Are you sure you want to withdraw this application?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Withdraw",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("job_applications")
                .delete()
                .eq("id", applicationId);

              if (error) throw error;

              setApplications(prev => prev.filter(app => app.id !== applicationId));
              Alert.alert("Success", "Application withdrawn successfully");
            } catch (error) {
              console.error("Error withdrawing application:", error);
              Alert.alert("Error", "Failed to withdraw application");
            }
          },
        },
      ]
    );
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

      <View style={styles.boutiqueInfo}>
        <Text style={styles.boutiqueName}>
          {item.job.boutique.profile?.full_name || item.job.boutique.email}
        </Text>
        <Text style={styles.boutiqueEmail}>{item.job.boutique.email}</Text>
        {item.job.boutique.profile?.phone && (
          <Text style={styles.boutiquePhone}>{item.job.boutique.profile.phone}</Text>
        )}
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Job Budget:</Text>
          <Text style={styles.detailValue}>
            ₹{item.job.budget_min.toLocaleString()} - ₹{item.job.budget_max.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Your Proposal:</Text>
          <Text style={styles.detailValue}>₹{item.proposed_budget.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{item.job.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Job Type:</Text>
          <Text style={styles.detailValue}>
            {item.job.job_type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.job.deadline).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Applied:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.jobDescription}>
        <Text style={styles.jobDescriptionTitle}>Job Description:</Text>
        <Text style={styles.jobDescriptionText} numberOfLines={3}>
          {item.job.description}
        </Text>
      </View>

      <View style={styles.coverLetter}>
        <Text style={styles.coverLetterTitle}>Your Cover Letter:</Text>
        <Text style={styles.coverLetterText} numberOfLines={3}>
          {item.cover_letter}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => handleMessageBoutique(
            item.job.boutique.id || "", 
            item.job.boutique.profile?.full_name || item.job.boutique.email
          )}
        >
          <Text style={styles.messageButtonText}>Message Boutique</Text>
        </TouchableOpacity>

        {item.status === "pending" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.withdrawButton]}
            onPress={() => handleWithdrawApplication(item.id)}
          >
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        )}

        {item.status === "accepted" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => Alert.alert("Congratulations!", "Your application has been accepted!")}
          >
            <Text style={styles.acceptButtonText}>View Details</Text>
          </TouchableOpacity>
        )}
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
        <Text style={styles.loadingText}>Loading your applications...</Text>
      </View>
    );
  }

  const filteredApplications = applications.filter(app => 
    filter === "all" || app.status === filter
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
      </View>

      {renderFilterButtons()}

      {filteredApplications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No applications found</Text>
          <Text style={styles.emptySubtitle}>
            {filter === "all" 
              ? "Start applying to jobs to see your applications here"
              : `No ${filter} applications found`
            }
          </Text>
          {filter === "all" && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("JobBoard")}
            >
              <Text style={styles.emptyButtonText}>Browse Jobs</Text>
            </TouchableOpacity>
          )}
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
  boutiqueInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  boutiqueName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  boutiqueEmail: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  boutiquePhone: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  jobDetails: {
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
  jobDescription: {
    marginBottom: 12,
  },
  jobDescriptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray[700],
    marginBottom: 4,
  },
  jobDescriptionText: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
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
  messageButton: {
    backgroundColor: Colors.primary[600],
  },
  messageButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  withdrawButton: {
    backgroundColor: Colors.error[100],
  },
  withdrawButtonText: {
    color: Colors.error[600],
    fontSize: 14,
    fontWeight: "600",
  },
  acceptButton: {
    backgroundColor: Colors.success[600],
  },
  acceptButtonText: {
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