import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Trash2,
  RefreshCw,
  CircleCheck as CheckCircle2,
  X,
  MessageSquare,
} from "lucide-react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

interface ActionButtonsProps {
  onDelete: () => void;
  onReAnalyze: (additionalMessage: string) => void;
  onSave: () => void;
  isUpdating: boolean;
  isPosting: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDelete,
  onReAnalyze,
  onSave,
  isUpdating,
  isPosting,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showReanalyzeModal, setShowReanalyzeModal] = useState(false);
  const [reanalyzeMessage, setReanalyzeMessage] = useState("");

  const handleReanalyzePress = () => {
    setShowReanalyzeModal(true);
  };

  const handleConfirmReanalyze = () => {
    setShowReanalyzeModal(false);
    onReAnalyze(reanalyzeMessage);
    setReanalyzeMessage("");
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onSave}
          disabled={isPosting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryGradient}
          >
            {isPosting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <CheckCircle2 size={24} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {t("camera.saveMeal") || "Save Meal"}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.reanalyzeButton]}
            onPress={handleReanalyzePress}
            disabled={isUpdating}
            activeOpacity={0.7}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <RefreshCw size={20} color="#3B82F6" />
            )}
            <Text style={[styles.secondaryText, { color: "#3B82F6" }]}>
              {isUpdating
                ? t("common.updating") || "Updating..."
                : t("camera.reanalyze") || "Re-analyze"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, styles.deleteButton]}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color="#EF4444" />
            <Text style={[styles.secondaryText, { color: "#EF4444" }]}>
              {t("common.delete") || "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showReanalyzeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReanalyzeModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Re-analyze Meal</Text>
              <TouchableOpacity onPress={() => setShowReanalyzeModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputHeader}>
                <MessageSquare size={18} color="#10B981" />
                <Text style={styles.inputLabel}>
                  Additional information (Optional)
                </Text>
              </View>
              <TextInput
                style={styles.messageInput}
                value={reanalyzeMessage}
                onChangeText={setReanalyzeMessage}
                placeholder="Add details to improve analysis..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowReanalyzeModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmReanalyze}
              >
                <LinearGradient
                  colors={["#3B82F6", "#2563EB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalConfirmGradient}
                >
                  <RefreshCw size={20} color="#FFFFFF" />
                  <Text style={styles.modalConfirmText}>Re-analyze</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  secondaryButtons: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  reanalyzeButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  modalBody: {
    padding: 20,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  messageInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
    color: "#1F2937",
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalConfirmGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
