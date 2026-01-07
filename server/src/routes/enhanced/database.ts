import { Router } from "express";
import { authenticateToken, AuthRequest } from "../../middleware/auth";
import { DatabaseOptimizationService } from "../../services/database/optimization";
import { EnhancedCronJobService } from "../../services/cron/enhanced";
import { ApiResponse } from "../../types/api";

const router = Router();

// Shared permission check helper (DRY principle)
const requireGoldSubscription = (req: AuthRequest, res: any): boolean => {
  if (req.user.subscription_type !== "GOLD") {
    res.status(403).json({
      success: false,
      error: "Insufficient permissions - GOLD subscription required",
      timestamp: new Date().toISOString(),
    });
    return false;
  }
  return true;
};

// Shared error handler (DRY principle)
const handleError = (res: any, error: unknown, message: string) => {
  console.error(`${message}:`, error);
  res.status(500).json({
    success: false,
    error: message,
    details: error instanceof Error ? error.message : "Unknown error",
    timestamp: new Date().toISOString(),
  });
};

// GET /api/database/health - Check database health (NO CHANGES - already optimal)
router.get("/health", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const health = await DatabaseOptimizationService.checkDatabaseHealth();

    res.json({
      success: true,
      data: health,
      message: `Database status: ${health.status}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleError(res, error, "Failed to check database health");
  }
});

// POST /api/database/cleanup - Trigger database cleanup
router.post("/cleanup", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!requireGoldSubscription(req, res)) return;

    console.log("🧹 Database cleanup by user:", req.user.user_id);

    const cleanupResult =
      await DatabaseOptimizationService.performIntelligentCleanup();

    res.json({
      success: true,
      data: cleanupResult,
      message: `Cleanup completed: ${cleanupResult.deletedRecords} records deleted`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleError(res, error, "Failed to perform database cleanup");
  }
});

// POST /api/database/optimize - Trigger database optimization
router.post("/optimize", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!requireGoldSubscription(req, res)) return;

    console.log("⚡ Database optimization by user:", req.user.user_id);

    await DatabaseOptimizationService.optimizeDatabase();

    res.json({
      success: true,
      message: "Database optimization completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleError(res, error, "Failed to optimize database");
  }
});

// GET /api/database/cron-status - Get cron job status (NO CHANGES - already optimal)
router.get("/cron-status", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const status = EnhancedCronJobService.getJobStatus();

    res.json({
      success: true,
      data: status,
      message: "Cron job status retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleError(res, error, "Failed to get cron status");
  }
});

// POST /api/database/emergency-recovery - Emergency database recovery
router.post(
  "/emergency-recovery",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      if (!requireGoldSubscription(req, res)) return;

      console.log("🚨 Emergency recovery by user:", req.user.user_id);

      const recovered = await DatabaseOptimizationService.emergencyRecovery();

      res.status(recovered ? 200 : 500).json({
        success: recovered,
        data: { recovered },
        message: recovered
          ? "Emergency recovery completed successfully"
          : "Emergency recovery failed",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleError(res, error, "Emergency recovery failed");
    }
  }
);

export { router as enhancedDatabaseRoutes };
