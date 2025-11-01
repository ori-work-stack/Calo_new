import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Camera, Image as ImageIcon } from "lucide-react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { useTranslation } from "react-i18next";

interface ImageSelectorProps {
  onTakePhoto: () => void;
  onSelectFromGallery: () => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  onTakePhoto,
  onSelectFromGallery,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("camera.title") || "Meal Scanner"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            {t("camera.subtitle") ||
              "Take a photo or select from gallery to analyze your meal"}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[
              styles.card,
              styles.cameraCard,
              { backgroundColor: colors.emerald500 },
            ]}
            onPress={onTakePhoto}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconWrapper}>
              <Camera size={56} color="#FFFFFF" strokeWidth={1.5} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {t("camera.takePhoto") || "Take Photo"}
              </Text>
              <Text style={styles.cardDescription}>
                Use your camera to capture a meal
              </Text>
            </View>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              styles.galleryCard,
              {
                backgroundColor: colors.emerald500 + "10",
                borderColor: colors.emerald500 + "30",
              },
            ]}
            onPress={onSelectFromGallery}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.cardIconWrapper,
                { backgroundColor: colors.emerald500 + "20" },
              ]}
            >
              <ImageIcon
                size={56}
                color={colors.emerald500}
                strokeWidth={1.5}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t("camera.chooseFromGallery") || "Choose from Gallery"}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.icon }]}>
                Select an existing photo from your device
              </Text>
            </View>
            <View style={styles.cardArrow}>
              <Text
                style={[styles.arrowText, { color: colors.emerald500 }]}
              >
                →
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, { backgroundColor: colors.emerald500 + "08" }]}>
          <Text style={[styles.footerText, { color: colors.icon }]}>
            💡 Tip: Make sure your meal is well-lit for best results
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 32,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: -0.2,
    maxWidth: "85%",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cameraCard: {
    borderWidth: 0,
  },
  galleryCard: {
    borderWidth: 2,
  },
  cardIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.85,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  cardArrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 28,
    fontWeight: "300",
    color: "#FFFFFF",
    opacity: 0.7,
  },
  footer: {
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});