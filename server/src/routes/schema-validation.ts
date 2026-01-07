import { Router } from "express";
import { SchemaValidator } from "../utils/schemaValidator";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";

const router = Router();

// Optimized: Added requireAdmin middleware, computed summary efficiently
router.get(
  "/validate",
  authenticateToken,
  requireAdmin, // CRITICAL: Added admin check for security
  async (req: AuthRequest, res) => {
    try {
      const results = await SchemaValidator.validateAllSchemas();

      // Compute summary in a single pass
      const summary = results.reduce(
        (acc, r) => {
          acc.total++;
          if (r.issues.length === 0) acc.fullyImplemented++;
          else if (r.issues.length < 3) acc.partiallyImplemented++;
          else acc.notImplemented++;
          return acc;
        },
        {
          total: 0,
          fullyImplemented: 0,
          partiallyImplemented: 0,
          notImplemented: 0,
        }
      );

      res.json({
        success: true,
        data: results,
        summary,
      });
    } catch (error) {
      console.error("Schema validation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to validate schemas",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export { router as schemaValidationRoutes };
