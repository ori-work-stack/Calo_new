import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageRecoveryService {
  static async clearOversizedEntries(): Promise<{
    success: boolean;
    removed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let removed = 0;

    try {
      console.log("🔧 Starting storage recovery...");

      let keys: readonly string[] = [];

      try {
        keys = await AsyncStorage.getAllKeys();
        console.log(`📋 Found ${keys.length} storage keys`);
      } catch (getAllKeysError) {
        console.error("❌ Failed to get all keys:", getAllKeysError);
        errors.push("Failed to enumerate storage keys");

        try {
          console.log("🚨 Attempting nuclear cleanup...");
          await AsyncStorage.clear();
          console.log("✅ Storage cleared successfully");
          return { success: true, removed: -1, errors };
        } catch (clearError) {
          errors.push("Failed to clear storage");
          return { success: false, removed: 0, errors };
        }
      }

      const MAX_SAFE_SIZE = 100 * 1024;
      const CHUNK_SIZE = 10;

      for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
        const keyChunk = keys.slice(i, i + CHUNK_SIZE);

        for (const key of keyChunk) {
          try {
            const value = await AsyncStorage.getItem(key);

            if (value) {
              const size = new Blob([value]).size;

              if (size > MAX_SAFE_SIZE) {
                console.log(
                  `🗑️  Removing oversized entry: ${key} (${(
                    size / 1024
                  ).toFixed(1)}KB)`
                );
                await AsyncStorage.removeItem(key);
                removed++;
              }
            }
          } catch (itemError: any) {
            console.log(`⚠️  Key "${key}" is unreadable, removing it...`);

            try {
              await AsyncStorage.removeItem(key);
              removed++;
            } catch (removeError: any) {
              console.error(`❌ Failed to remove "${key}":`, removeError);
              errors.push(`Failed to remove key: ${key}`);
            }
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      console.log(`✅ Storage recovery complete. Removed ${removed} items.`);

      return {
        success: true,
        removed,
        errors,
      };
    } catch (error: any) {
      console.error("❌ Storage recovery failed:", error);
      errors.push(error.message || "Unknown error");

      return {
        success: false,
        removed,
        errors,
      };
    }
  }

  static async clearPendingMealImages(): Promise<void> {
    try {
      console.log("🗑️  Clearing any stored meal images...");

      const mealKey = "pendingMeal";
      const stored = await AsyncStorage.getItem(mealKey);

      if (stored) {
        try {
          const data = JSON.parse(stored);

          if (data && data.image_base_64) {
            const cleanData = {
              analysis: data.analysis,
              timestamp: data.timestamp,
            };

            await AsyncStorage.setItem(mealKey, JSON.stringify(cleanData));
            console.log("✅ Removed base64 image from pending meal");
          }
        } catch (parseError) {
          await AsyncStorage.removeItem(mealKey);
          console.log("✅ Removed corrupted pending meal data");
        }
      }
    } catch (error) {
      console.error("Error clearing pending meal images:", error);
    }
  }

  static async performFullRecovery(): Promise<void> {
    console.log("🔧 Starting full storage recovery...");

    await this.clearPendingMealImages();
    await this.clearOversizedEntries();

    console.log("✅ Full storage recovery complete");
  }
}
