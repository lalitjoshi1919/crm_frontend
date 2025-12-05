const redis = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

let client;
let isConnecting = false;
let connectionPromise = null;

// Initialize Redis client
try {
  const socketConfig = redisUrl.startsWith("rediss://") 
    ? { tls: true, reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error("Redis: Max reconnection attempts reached");
          return new Error("Max reconnection attempts reached");
        }
        return Math.min(retries * 100, 3000);
      }, connectTimeout: 5000 }
    : { reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error("Redis: Max reconnection attempts reached");
          return new Error("Max reconnection attempts reached");
        }
        return Math.min(retries * 100, 3000);
      }, connectTimeout: 5000 };

  client = redis.createClient({
    url: redisUrl,
    socket: socketConfig,
  });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err.message);
    isConnecting = false;
  });

  client.on("connect", () => {
    console.log("Redis client connecting...");
  });

  client.on("ready", () => {
    console.log("Redis client connected and ready");
    isConnecting = false;
  });

  client.on("reconnecting", () => {
    console.log("Redis client reconnecting...");
  });

  client.on("end", () => {
    console.log("Redis client connection ended");
    isConnecting = false;
  });
} catch (error) {
  console.error("Failed to create Redis client:", error.message);
}

// Helper function to ensure connection with fast-fail for request handlers
const ensureConnection = async (timeout = 500) => {
  if (!client) {
    return false; // Don't throw, just return false
  }

  // If already connected, return immediately
  if (client.isReady) {
    return true;
  }

  // If already connecting, wait with timeout
  if (isConnecting && connectionPromise) {
    try {
      // Use Promise.race to add timeout
      await Promise.race([
        connectionPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Connection timeout")), timeout)
        )
      ]);
      return true;
    } catch (error) {
      // If timeout or connection failed, don't block - return false
      if (error.message === "Connection timeout") {
        return false;
      }
      isConnecting = false;
      connectionPromise = null;
      return false;
    }
  }

  // Start new connection only if not already connecting
  if (!isConnecting) {
    isConnecting = true;
    connectionPromise = client.connect().catch((error) => {
      isConnecting = false;
      connectionPromise = null;
      return false;
    });
  }

  try {
    // Wait with timeout for new connections
    await Promise.race([
      connectionPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout")), timeout)
      )
    ]);
    return true;
  } catch (error) {
    isConnecting = false;
    connectionPromise = null;
    return false;
  }
};

// Connect to Redis on startup (non-blocking)
(async () => {
  try {
    if (client) {
      await ensureConnection();
    }
  } catch (error) {
    console.error("Redis initial connection failed:", error.message);
    console.log("Application will continue, but Redis features may be unavailable");
  }
})();

// Store JWT with expiry (default 1 hour)
const setJWT = async (key, value, ttl = 3600) => {
  try {
    const connected = await ensureConnection(500); // Fast-fail after 500ms
    if (!connected || !client.isReady) {
      // Redis not available, but don't block the request
      return null;
    }
    return await client.set(key, value, { EX: ttl });
  } catch (err) {
    // Silently fail - don't block authentication
    return null;
  }
};

const getJWT = async (key) => {
  try {
    const connected = await ensureConnection(500); // Fast-fail after 500ms
    if (!connected || !client.isReady) {
      // Redis not available, return null (session check will fail, but won't block)
      return null;
    }
    return await client.get(key);
  } catch (err) {
    // Silently fail - don't block authentication
    return null;
  }
};

const deleteJWT = async (key) => {
  try {
    const connected = await ensureConnection(500); // Fast-fail after 500ms
    if (!connected || !client.isReady) {
      // Redis not available, but don't block logout
      return null;
    }
    return await client.del(key);
  } catch (err) {
    // Silently fail - don't block logout
    return null;
  }
};

module.exports = { setJWT, getJWT, deleteJWT };
