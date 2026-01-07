import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth";

export interface AuthRequest extends Request {
  user?: any;
}

// Token extraction helper (DRY principle)
const extractToken = (req: Request): string | null => {
  // Check cookie first (faster for web clients)
  const cookieToken = req.cookies.auth_token;
  if (cookieToken) return cookieToken;

  // Fallback to Authorization header (mobile)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
};

// Optimized: Removed excessive console.logs, added early returns
export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Missing or invalid authorization",
      });
    }

    // Verify token (this should ideally be cached with short TTL)
    const user = await AuthService.verifyToken(token);
    req.user = user;
    next();
  } catch (error: any) {
    // Database connection errors get special handling
    if (
      error.message?.includes("Can't reach database") ||
      error.message?.includes("connection")
    ) {
      return res.status(503).json({
        success: false,
        error: "Database temporarily unavailable",
        retryAfter: 5,
      });
    }

    // All other errors are auth failures
    res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}

// Shared permission check helper (DRY principle)
const checkAuthAndEmail = (
  req: AuthRequest,
  res: Response,
  requiredLevel: "admin" | "super_admin"
): boolean => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: "Authentication required",
    });
    return false;
  }

  if (!req.user.email_verified) {
    res.status(403).json({
      success: false,
      error: "Email verification required",
    });
    return false;
  }

  const hasPermission =
    requiredLevel === "super_admin"
      ? req.user.is_super_admin
      : req.user.is_admin || req.user.is_super_admin;

  if (!hasPermission) {
    console.warn(`⚠️ Unauthorized ${requiredLevel} access: ${req.user.email}`);
    res.status(403).json({
      success: false,
      error: `${
        requiredLevel === "super_admin" ? "Super admin" : "Admin"
      } access required`,
    });
    return false;
  }

  return true;
};

// Optimized: Consolidated duplicate code
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (checkAuthAndEmail(req, res, "admin")) {
      next();
    }
  } catch (error) {
    console.error("Admin authorization error:", error);
    res.status(500).json({
      success: false,
      error: "Authorization failed",
    });
  }
};

// Optimized: Consolidated duplicate code
export const requireSuperAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (checkAuthAndEmail(req, res, "super_admin")) {
      next();
    }
  } catch (error) {
    console.error("Super admin authorization error:", error);
    res.status(500).json({
      success: false,
      error: "Authorization failed",
    });
  }
};
