import redisClient from "../config/redis.js";

const LUA_SCRIPT = `
local current = redis.call("INCR", KEYS[1])

if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end

local ttl = redis.call("TTL", KEYS[1])

return {current, ttl}
`;

export function createRateLimiter({
  prefix,
  maxRequests,
  windowSeconds
}) {
  return async function rateLimiter(
    req,
    res,
    next
  ) {
    try {
      const identifier =
        req.user?.uid
          ? `user:${req.user.uid}`
          : `ip:${req.ip}`;

      const key =
        `rate-limit:${prefix}:${identifier}`;

      const result =
        await redisClient.eval(
          LUA_SCRIPT,
          {
            keys: [key],
            arguments: [
              String(windowSeconds)
            ]
          }
        );

      const current =
        Number(result[0]);

      const ttl =
        Number(result[1]);

      const remaining =
        Math.max(
          maxRequests - current,
          0
        );

      res.setHeader(
        "X-RateLimit-Limit",
        String(maxRequests)
      );

      res.setHeader(
        "X-RateLimit-Remaining",
        String(remaining)
      );

      res.setHeader(
        "X-RateLimit-Reset",
        String(
          Math.max(ttl, 0)
        )
      );

      if (
        current > maxRequests
      ) {
        res.setHeader(
          "Retry-After",
          String(
            Math.max(ttl, 1)
          )
        );

        return res
          .status(429)
          .json({
            message:
              "Too many requests. Please try again later."
          });
      }

      return next();
    } catch (error) {
      console.error(
        "Rate limiter error:",
        error.message
      );

      /*
        Redis lỗi thì không làm toàn
        Gateway chết.
      */
      return next();
    }
  };
}