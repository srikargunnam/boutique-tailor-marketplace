import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import { JOB_STATUS } from "../constants/api";
import { Job } from "../services/supabase";

interface JobCardProps {
  job: Job;
  onPress: () => void;
  showDetails?: boolean;
}

export default function JobCard({
  job,
  onPress,
  showDetails = false,
}: JobCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case JOB_STATUS.OPEN:
        return Colors.success[500];
      case JOB_STATUS.IN_PROGRESS:
        return Colors.warning[500];
      case JOB_STATUS.COMPLETED:
        return Colors.gray[500];
      default:
        return Colors.gray[500];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {job.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(job.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {job.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      {showDetails && (
        <>
          <Text style={styles.description} numberOfLines={3}>
            {job.description}
          </Text>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>
                ₹{job.budget.toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{job.location}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Deadline:</Text>
              <Text style={styles.detailValue}>{formatDate(job.deadline)}</Text>
            </View>
          </View>
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.date}>Posted on {formatDate(job.created_at)}</Text>
        {!showDetails && (
          <Text style={styles.budget}>₹{job.budget.toLocaleString()}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  description: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.gray[500],
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    color: Colors.gray[700],
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  date: {
    fontSize: 12,
    color: Colors.gray[500],
  },
  budget: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary[600],
  },
});
