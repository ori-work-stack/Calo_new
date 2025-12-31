import {
  ChefHat,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";

export const FILTER_OPTIONS = [
  { key: "all", label: "All Menus", icon: ChefHat },
  { key: "recent", label: "Recent", icon: Clock },
  { key: "high_protein", label: "High Protein", icon: TrendingUp },
  { key: "low_calorie", label: "Low Calorie", icon: Target },
  { key: "quick_prep", label: "Quick Prep", icon: Zap },
  { key: "budget_friendly", label: "Budget Friendly", icon: DollarSign },
] as const;
