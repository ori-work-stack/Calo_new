export interface RecommendedMenu {
  menu_id: string;
  title: string;
  description?: string;
  total_calories: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
  days_count: number;
  dietary_category?: string;
  estimated_cost?: number;
  prep_time_minutes?: number;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
  meals: Array<{
    meal_id: string;
    name: string;
    meal_type: string;
    day_number: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    prep_time_minutes?: number;
    cooking_method?: string;
    instructions?: string;
    ingredients: Array<{
      ingredient_id: string;
      name: string;
      quantity: number;
      unit: string;
      category?: string;
      estimated_cost?: number;
    }>;
  }>;
}

export interface Ingredient {
  ingredient_id: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  estimated_cost?: number;
}

export interface Meal {
  meal_id: string;
  name: string;
  meal_type: string;
  day_number: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  prep_time_minutes?: number;
  cooking_method?: string;
  instructions?: string;
  dietary_category?: string;
  ingredients: Ingredient[];
}

export interface MenuDetails {
  menu_id: string;
  title: string;
  description?: string;
  total_calories: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
  days_count: number;
  dietary_category?: string;
  estimated_cost?: number;
  prep_time_minutes?: number;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
  meals: Meal[];
}
export interface MealPlan {
  plan_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  target_calories_daily?: number;
  target_protein_daily?: number;
  target_carbs_daily?: number;
  target_fats_daily?: number;
  weekly_plan: {
    [day: string]: {
      [timing: string]: PlanMeal[];
    };
  };
  days_count: number; // Added for clarity in calculations
}

export interface PlanMeal {
  template_id: string;
  name: string;
  description?: string;
  meal_timing: string;
  dietary_category: string;
  prep_time_minutes?: number;
  difficulty_level?: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  ingredients: string[];
  instructions: string[];
  allergens: string[];
  image_url?: string;
  user_rating?: number;
  user_comments?: string;
  is_favorite?: boolean;
}

export interface SwapRequest {
  currentMeal: PlanMeal;
  dayName: string;
  mealTiming: string;
  preferences?: {
    userNotes?: string;
    targetCalories?: string;
    targetProtein?: string;
    targetCarbs?: string;
    targetFat?: string;
    dietary_category?: string;
    max_prep_time?: number;
    protein_preference?: "higher" | "lower" | "same";
    calorie_preference?: "higher" | "lower" | "same";
  };
}

export interface MealCompletionData {
  rating: number;
  notes: string;
  prep_time_actual: number;
}

export interface SelectedMealForCompletion {
  meal: PlanMeal;
  dayName: string;
  timing: string;
}