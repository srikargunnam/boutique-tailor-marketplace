import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
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

type PortfolioScreenNavigationProp = StackNavigationProp<RootStackParamList, "Portfolio">;

interface Props {
  navigation: PortfolioScreenNavigationProp;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  created_at: string;
}

interface Profile {
  full_name?: string;
  phone?: string;
  experience_years?: number;
  specializations?: string[];
  bio?: string;
  location?: string;
  hourly_rate?: number;
}

export default function PortfolioScreen({ navigation }: Props) {
  const { user } = useAppStore();
  const [profile, setProfile] = useState<Profile>({});
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Profile>({});

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned

      if (data) {
        setProfile(data);
        setEditForm(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("tailor_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPortfolioItems(data || []);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      Alert.alert("Error", "Failed to load portfolio items");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPortfolioItems();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
    fetchPortfolioItems();
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user?.id,
          ...editForm,
        });

      if (error) throw error;

      setProfile(editForm);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleAddPortfolioItem = () => {
    // TODO: Implement portfolio item upload functionality
    Alert.alert("Coming Soon", "Portfolio upload functionality will be available soon!");
  };

  const handleDeletePortfolioItem = (itemId: string) => {
    Alert.alert(
      "Delete Portfolio Item",
      "Are you sure you want to delete this portfolio item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("portfolio_items")
                .delete()
                .eq("id", itemId);

              if (error) throw error;

              setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
              Alert.alert("Success", "Portfolio item deleted successfully");
            } catch (error) {
              console.error("Error deleting portfolio item:", error);
              Alert.alert("Error", "Failed to delete portfolio item");
            }
          },
        },
      ]
    );
  };

  const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => (
    <View style={styles.portfolioCard}>
      <View style={styles.portfolioHeader}>
        <Text style={styles.portfolioTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePortfolioItem(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.portfolioCategory}>{item.category}</Text>
      <Text style={styles.portfolioDescription} numberOfLines={3}>
        {item.description}
      </Text>

      {item.image_url && (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>📷 Image</Text>
        </View>
      )}

      <Text style={styles.portfolioDate}>
        Added: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Professional Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.editForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={editForm.full_name || ""}
              onChangeText={(value) => setEditForm(prev => ({ ...prev, full_name: value }))}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editForm.phone || ""}
              onChangeText={(value) => setEditForm(prev => ({ ...prev, phone: value }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={editForm.location || ""}
              onChangeText={(value) => setEditForm(prev => ({ ...prev, location: value }))}
              placeholder="Enter your location"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Experience (Years)</Text>
            <TextInput
              style={styles.input}
              value={editForm.experience_years?.toString() || ""}
              onChangeText={(value) => setEditForm(prev => ({ ...prev, experience_years: parseInt(value) || 0 }))}
              placeholder="Enter years of experience"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hourly Rate (₹)</Text>
            <TextInput
              style={styles.input}
              value={editForm.hourly_rate?.toString() || ""}
              onChangeText={(value) => setEditForm(prev => ({ ...prev, hourly_rate: parseInt(value) || 0 }))}
              placeholder="Enter your hourly rate"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editForm.bio || ""}
              onChangeText={(value) => setEditForm(prev => ({ ...prev, bio: value }))}
              placeholder="Tell us about yourself and your expertise..."
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>
              {profile.full_name || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>
              {profile.phone || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>
              {profile.location || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience:</Text>
            <Text style={styles.infoValue}>
              {profile.experience_years ? `${profile.experience_years} years` : "Not specified"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hourly Rate:</Text>
            <Text style={styles.infoValue}>
              {profile.hourly_rate ? `₹${profile.hourly_rate}/hr` : "Not specified"}
            </Text>
          </View>
          {profile.bio && (
            <View style={styles.bioSection}>
              <Text style={styles.bioLabel}>Bio:</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          )}
          {profile.specializations && profile.specializations.length > 0 && (
            <View style={styles.specializationsSection}>
              <Text style={styles.specializationsLabel}>Specializations:</Text>
              <View style={styles.specializationTags}>
                {profile.specializations.map((spec, index) => (
                  <View key={index} style={styles.specializationTag}>
                    <Text style={styles.specializationText}>{spec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading portfolio...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPortfolioItem}
        >
          <Text style={styles.addButtonText}>+ Add Work</Text>
        </TouchableOpacity>
      </View>

      {renderProfileSection()}

      <View style={styles.portfolioSection}>
        <Text style={styles.sectionTitle}>Portfolio Items</Text>
        
        {portfolioItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No portfolio items yet</Text>
            <Text style={styles.emptySubtitle}>
              Showcase your best work to attract more job opportunities
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleAddPortfolioItem}
            >
              <Text style={styles.emptyButtonText}>Add Your First Work</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={portfolioItems}
            renderItem={renderPortfolioItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </ScrollView>
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
  addButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  profileSection: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
  },
  editButton: {
    backgroundColor: Colors.secondary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: Colors.secondary[700],
    fontSize: 14,
    fontWeight: "600",
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray[700],
  },
  input: {
    backgroundColor: Colors.gray[50],
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
  saveButton: {
    backgroundColor: Colors.primary[600],
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  profileInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: Colors.gray[800],
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  bioSection: {
    marginTop: 8,
  },
  bioLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: "500",
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: Colors.gray[800],
    lineHeight: 20,
  },
  specializationsSection: {
    marginTop: 8,
  },
  specializationsLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: "500",
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
  portfolioSection: {
    margin: 20,
  },
  portfolioCard: {
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
  portfolioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    flex: 1,
    marginRight: 12,
  },
  deleteButton: {
    backgroundColor: Colors.error[100],
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: Colors.error[600],
    fontSize: 16,
    fontWeight: "bold",
  },
  portfolioCategory: {
    fontSize: 12,
    color: Colors.primary[600],
    fontWeight: "600",
    marginBottom: 8,
  },
  portfolioDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  imagePlaceholder: {
    backgroundColor: Colors.gray[100],
    height: 120,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: Colors.gray[500],
  },
  portfolioDate: {
    fontSize: 12,
    color: Colors.gray[500],
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
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
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