import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import JobCard from "../components/JobCard";
import Paywall from "../components/Paywall";
import { Colors } from "../constants/Colors";
import { useAppStore } from "../services/store";
import { Job, supabase } from "../services/supabase";

type JobBoardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "JobBoard"
>;

interface Props {
  navigation: JobBoardScreenNavigationProp;
}

export default function JobBoardScreen({ navigation }: Props) {
  const {
    user,
    setJobs,
    jobs,
    setPaywallVisible,
    isPaywallVisible,
    canAccessJobDetails,
  } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (locationFilter) {
        query = query.ilike("location", `%${locationFilter}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching jobs:", error);
        Alert.alert("Error", "Failed to load jobs");
        return;
      }

      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert("Error", "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobPress = (job: Job) => {
    if (!canAccessJobDetails()) {
      setPaywallVisible(true);
      return;
    }
    navigation.navigate("JobDetails", { jobId: job.id });
  };

  const handleSubscribe = (planId: string) => {
    setPaywallVisible(false);
    navigation.navigate("Subscription");
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderJobCard = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={() => handleJobPress(item)}
      showDetails={canAccessJobDetails()}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TextInput
          style={styles.locationInput}
          placeholder="Filter by location..."
          value={locationFilter}
          onChangeText={setLocationFilter}
        />
        <TouchableOpacity style={styles.filterButton} onPress={fetchJobs}>
          <Text style={styles.filterButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {!canAccessJobDetails() && (
        <View style={styles.upgradeBanner}>
          <Text style={styles.upgradeText}>
            🔒 Upgrade to see job details and apply
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => setPaywallVisible(true)}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.jobList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? "Loading jobs..." : "No jobs found"}
            </Text>
          </View>
        }
      />

      <Paywall
        visible={isPaywallVisible}
        onClose={() => setPaywallVisible(false)}
        onSubscribe={handleSubscribe}
        title="Unlock Job Details"
        message="Subscribe to view complete job details and apply to opportunities"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.gray[50],
    marginBottom: 8,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.gray[50],
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: Colors.primary[600],
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  upgradeBanner: {
    backgroundColor: Colors.warning[100],
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.warning[200],
  },
  upgradeText: {
    color: Colors.warning[800],
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: Colors.warning[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  upgradeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  jobList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[500],
    textAlign: "center",
  },
});
