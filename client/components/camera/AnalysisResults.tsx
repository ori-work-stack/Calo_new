import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Flame, Activity, Droplet } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface AnalysisResultsProps {
  imageUri: string;
  mealName: string;
  nutrition: NutritionData;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  imageUri,
  mealName,
  nutrition,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={styles.imageOverlay}
        />
        <View style={styles.mealNameOverlay}>
          <Text style={styles.mealName}>{mealName}</Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.mainMacrosSection}>
          <View style={styles.macroCard}>
            <LinearGradient
              colors={["#F59E0B", "#D97706"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.macroCardGradient}
            >
              <Flame size={28} color="#FFFFFF" />
              <View style={styles.macroCardContent}>
                <Text style={styles.macroCardValue}>{nutrition.calories}</Text>
                <Text style={styles.macroCardLabel}>Calories</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.macroCard}>
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.macroCardGradient}
            >
              <Activity size={28} color="#FFFFFF" />
              <View style={styles.macroCardContent}>
                <Text style={styles.macroCardValue}>{nutrition.protein}g</Text>
                <Text style={styles.macroCardLabel}>Protein</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.macroCard}>
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.macroCardGradient}
            >
              <Droplet size={28} color="#FFFFFF" />
              <View style={styles.macroCardContent}>
                <Text style={styles.macroCardValue}>{nutrition.fat}g</Text>
                <Text style={styles.macroCardLabel}>Fat</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Carbs</Text>
            <Text style={styles.detailValue}>{nutrition.carbs}g</Text>
          </View>
          {nutrition.fiber > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fiber</Text>
              <Text style={styles.detailValue}>{nutrition.fiber}g</Text>
            </View>
          )}
          {nutrition.sugar > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sugar</Text>
              <Text style={styles.detailValue}>{nutrition.sugar}g</Text>
            </View>
          )}
          {nutrition.sodium > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sodium</Text>
              <Text style={styles.detailValue}>{nutrition.sodium}mg</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  imageSection: {
    width: "100%",
    height: 280,
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  mealNameOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  mealName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  contentSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 20,
  },
  mainMacrosSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  macroCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  macroCardGradient: {
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  macroCardContent: {
    alignItems: "center",
  },
  macroCardValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  macroCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
});
