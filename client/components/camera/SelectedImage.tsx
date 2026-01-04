import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { X, RotateCcw, Search, Check } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "i18next";

const { width, height } = Dimensions.get("window");

interface SelectedImageProps {
  imageUri: string;
  userComment: string;
  isAnalyzing: boolean;
  hasBeenAnalyzed: boolean;
  onRemoveImage: () => void;
  onRetakePhoto: () => void;
  onAnalyze: () => void;
  onCommentChange: (text: string) => void;
}

export const SelectedImage: React.FC<SelectedImageProps> = ({
  imageUri,
  userComment,
  isAnalyzing,
  hasBeenAnalyzed,
  onRemoveImage,
  onRetakePhoto,
  onAnalyze,
  onCommentChange,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  const scannerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showDetailsInput, setShowDetailsInput] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scannerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scannerAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isAnalyzing]);

  const scannerTranslateY = scannerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 400],
  });

  const handleSearchPress = () => {
    setShowDetailsInput(true);
  };

  const handleStartAnalysis = () => {
    setShowDetailsInput(false);
    onAnalyze();
  };

  return (
    <View style={styles.container}>
      {/* Full Screen Image */}
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          blurRadius={isAnalyzing ? 1 : 0}
        />

        <View style={styles.darkTint} />

        {/* Top Buttons */}
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={onRemoveImage}
            activeOpacity={0.7}
          >
            <BlurView intensity={60} tint="light" style={styles.topButtonBlur}>
              <X size={20} color="#1F2937" strokeWidth={2.5} />
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topButton}
            onPress={onRetakePhoto}
            activeOpacity={0.7}
          >
            <BlurView intensity={60} tint="light" style={styles.topButtonBlur}>
              <RotateCcw size={20} color="#1F2937" strokeWidth={2.5} />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Scanning */}
        {isAnalyzing && (
          <View style={styles.scanningOverlay}>
            <Animated.View
              style={[
                styles.scannerFrame,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
              <Animated.View
                style={[
                  styles.scannerLine,
                  { transform: [{ translateY: scannerTranslateY }] },
                ]}
              />
            </Animated.View>
            <Text style={styles.scanningText}>Scanning</Text>
          </View>
        )}
      </Animated.View>

      {/* Initial State */}
      {!isAnalyzing && !hasBeenAnalyzed && !showDetailsInput && (
        <Animated.View
          style={[
            styles.bottomContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <BlurView intensity={90} tint="dark" style={styles.bottomCard}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchPress}
              activeOpacity={0.8}
            >
              <View style={styles.searchIcon}>
                <Search size={22} color="#F59E0B" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
            <Text style={styles.promptText}>Tap to analyze</Text>
          </BlurView>
        </Animated.View>
      )}

      {/* Details State */}
      {!isAnalyzing && !hasBeenAnalyzed && showDetailsInput && (
        <Animated.View
          style={[
            styles.bottomContent,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <BlurView intensity={90} tint="dark" style={styles.detailsCard}>
            <TextInput
              style={styles.input}
              value={userComment}
              onChangeText={onCommentChange}
              placeholder="Add notes (optional)..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              autoFocus
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={handleStartAnalysis}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.analyzeBtn}
                onPress={handleStartAnalysis}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.analyzeBtnGradient}
                >
                  <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.analyzeText}>Analyze</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <Animated.View
          style={[
            styles.bottomContent,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <BlurView intensity={90} tint="dark" style={styles.bottomCard}>
            <View style={styles.searchButton}>
              <View style={styles.searchIcon}>
                <ActivityIndicator size={22} color="#F59E0B" />
              </View>
            </View>
            <Text style={styles.promptText}>Searching...</Text>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  darkTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },

  topActions: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  topButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.8,
    position: "relative",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#10B981",
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#10B981",
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#10B981",
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#10B981",
    borderBottomRightRadius: 8,
  },
  scannerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#10B981",
  },
  scanningText: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  bottomContent: {
    position: "absolute",
    bottom: -30,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },

  bottomCard: {
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    overflow: "hidden",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  detailsCard: {
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    overflow: "hidden",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  searchButton: {
    marginBottom: 10,
  },
  searchIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(254, 243, 199, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },

  promptText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },

  input: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#FFFFFF",
    minHeight: 60,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  analyzeBtn: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  analyzeBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    gap: 6,
  },
  analyzeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
