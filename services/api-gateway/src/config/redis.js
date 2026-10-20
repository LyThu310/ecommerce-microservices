import "dotenv/config";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
  console.error(
    "Redis Client Error:",
    error.message
  );
});

redisClient.on("connect", () => {
  console.log(
    "Redis client connecting..."
  );
});

redisClient.on("ready", () => {
  console.log(
    "Redis client ready."
  );
});

export default redisClient;