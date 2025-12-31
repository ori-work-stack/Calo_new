import { Ionicons } from "@expo/vector-icons";

export type DeviceType =
  | "APPLE_HEALTH"
  | "GOOGLE_FIT"
  | "FITBIT"
  | "GARMIN"
  | "WHOOP"
  | "POLAR"
  | "SAMSUNG_HEALTH";

export interface SupportedDevice {
  type: DeviceType;
  name: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  available: boolean;
  description: string;
}
