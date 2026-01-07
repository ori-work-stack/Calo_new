import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/database";

const router = Router();

// Single endpoint to get ALL initial dashboard data
router.get(
  "/initial-data",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user.user_id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Run ALL queries in PARALLEL - this is the key!
      const [
        meals,
        dailyGoals,
        waterIntake,
        shoppingList,
        questionnaireData,
        usageStats,
        recentMessages,
      ] = await Promise.all([
        // Meals
        prisma.meal.findMany({
          where: { user_id: userId },
          orderBy: { created_at: "desc" },
          take: 15,
          select: {
            meal_id: true,
            meal_name: true,
            calories: true,
            protein_g: true,
            carbs_g: true,
            fats_g: true,
            created_at: true,
            image_url: true,
          },
        }),

        // Daily Goals
        prisma.dailyGoal.findFirst({
          where: {
            user_id: userId,
            date: today,
          },
        }),

        // Water Intake
        prisma.waterIntake.findFirst({
          where: {
            user_id: userId,
            date: { gte: today },
          },
        }),

        // Shopping List
        prisma.shoppingList.findMany({
          where: { user_id: userId },
          take: 5,
          orderBy: { created_at: "desc" },
        }),

        // Questionnaire (only needed fields)
        prisma.userQuestionnaire.findFirst({
          where: { user_id: userId },
          orderBy: { date_completed: "desc" },
          select: {
            age: true,
            weight_kg: true,
            height_cm: true,
            main_goal: true,
            physical_activity_level: true,
          },
        }),

        // Usage Stats
        prisma.user.findUnique({
          where: { user_id: userId },
          select: {
            meal_scans_count: true,
            meal_scans_reset_at: true,
            ai_chat_tokens_used: true,
            ai_chat_tokens_reset_at: true,
          },
        }),

        // Recent Chat Messages
        prisma.chatMessage.findMany({
          where: { user_id: userId },
          orderBy: { created_at: "desc" },
          take: 20,
          select: {
            message_id: true,
            user_message: true,
            ai_response: true,
            created_at: true,
          },
        }),
      ]);

      res.json({
        success: true,
        data: {
          meals,
          dailyGoals,
          waterIntake,
          shoppingList,
          questionnaire: questionnaireData,
          usage: usageStats,
          chatMessages: recentMessages,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
