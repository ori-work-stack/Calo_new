import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const MAX_SECURE_STORE_SIZE = 2048; // bytes
const COMPRESSION_THRESHOLD = 1024; // Compress items larger than 1KB
const MAX_ALLOWED_SIZE = 500 * 1024; // 500KB - NEVER store anything larger than this!

// Simple compression function
const compressString = (str: string): string => {
  try {
    // Remove unnecessary whitespace and format JSON more compactly
    if (str.startsWith("{") || str.startsWith("[")) {
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed); // This removes extra whitespace
    }

    // For non-JSON strings, just trim whitespace
    return str.replace(/\s+/g, " ").trim();
  } catch (error) {
    return str.trim();
  }
};

// Check if value contains base64 image data
const containsBase64Image = (value: string): boolean => {
  // Check for common base64 image patterns
  if (value.startsWith("data:image/")) return true;
  if (value.includes(";base64,")) return true;

  // Check for very long strings that look like base64
  if (
    value.length > 50000 &&
    /^[A-Za-z0-9+/=]+$/.test(value.substring(0, 1000))
  ) {
    return true;
  }

  return false;
};
// Update setSecureItem to handle SecureStore size limits and fallbacks
export const setSecureItem = async (
  key: string,
  value: string
): Promise<void> => {
  let processedValue = value;
  try {
    // Check initial size
    const initialSize = Buffer.byteLength(value, "utf8");

    // CRITICAL: Reject base64 images immediately
    if (containsBase64Image(value)) {
      throw new Error(
        `Cannot store base64 images in AsyncStorage/SecureStore. Key: ${key}`
      );
    }

    // CRITICAL: Reject any value over MAX_ALLOWED_SIZE
    if (initialSize > MAX_ALLOWED_SIZE) {
      throw new Error(
        `Value too large for storage (${(initialSize / 1024).toFixed(
          1
        )}KB). Key: ${key}. Use file system or database instead.`
      );
    }

    console.log(`📏 Initial size for ${key}: ${initialSize} bytes`);

    if (value.length > COMPRESSION_THRESHOLD) {
      processedValue = compressString(value);
      console.log(
        `🗜️ Compressed ${key}: ${value.length} -> ${processedValue.length} bytes`
      );
    }

    // Check if value is too large for SecureStore (2048 bytes limit)
    const valueSize = Buffer.byteLength(processedValue, "utf8");

    // Use a more conservative limit (1800 bytes) to account for key size and overhead
    const SAFE_SECURE_STORE_LIMIT = 1800;

    if (valueSize > SAFE_SECURE_STORE_LIMIT) {
      console.warn(
        `📦 Value for key "${key}" is ${valueSize} bytes (>${SAFE_SECURE_STORE_LIMIT}), using AsyncStorage fallback`
      );

      // Clean up any existing SecureStore entry
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (e) {
        // Ignore if key doesn't exist
      }

      await AsyncStorage.setItem(key, processedValue);
      return;
    }

    await SecureStore.setItemAsync(key, processedValue);
    // Clean up any previous async storage entry if SecureStore is used
    await AsyncStorage.removeItem(key).catch(() => {});
  } catch (error) {
    console.error(`Failed to set secure item ${key}:`, error);
    // Fallback to AsyncStorage if SecureStore fails
    try {
      console.log(`🔒 Fallback storage for key "${key}" using AsyncStorage`);
      await AsyncStorage.setItem(key, processedValue);
    } catch (fallbackError) {
      console.error(`Fallback storage also failed for ${key}:`, fallbackError);
      throw fallbackError;
    }
  }
};

// Update getSecureItem to handle AsyncStorage fallback for large values
export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) return value;

    // Try AsyncStorage as fallback
    const asyncValue = await AsyncStorage.getItem(key);
    return asyncValue;
  } catch (error) {
    console.error(`Failed to get secure item ${key}:`, error);
    // Try AsyncStorage as fallback
    try {
      return await AsyncStorage.getItem(key);
    } catch (fallbackError) {
      console.error(`Fallback storage also failed for ${key}:`, fallbackError);
      return null;
    }
  }
};

// Remove data from both storage types
export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key).catch(() => {});
    await AsyncStorage.removeItem(key).catch(() => {});
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
  }
};
