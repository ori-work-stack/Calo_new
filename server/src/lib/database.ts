import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Get database URL with connection pooling parameters
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Add connection pooling parameters if not present
  if (!url.includes("connection_limit")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}connection_limit=10&pool_timeout=20`;
  }

  return url;
};

// Create Prisma client with optimized configuration
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

// Optimized connection with retry logic
let isConnected = false;

export async function connectDatabase() {
  if (isConnected) return;

  try {
    await prisma.$connect();

    // Quick health check
    await prisma.$queryRaw`SELECT 1`;

    isConnected = true;
    console.log("✅ Database connected successfully");
    console.log("📊 Database health check passed");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

// Graceful shutdown
const disconnect = async () => {
  if (isConnected) {
    await prisma.$disconnect();
    isConnected = false;
  }
};

process.on("beforeExit", disconnect);
process.on("SIGINT", disconnect);
process.on("SIGTERM", disconnect);
