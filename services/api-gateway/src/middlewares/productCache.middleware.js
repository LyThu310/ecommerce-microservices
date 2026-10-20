import redisClient from "../config/redis.js";

const cacheTtlSeconds =
  Number(
    process.env.PRODUCT_CACHE_TTL_SECONDS
  ) || 60;

export async function getProductWithCache(
  req,
  res,
  next
) {
  try {
    const pid = Number(req.params.pid);

    if (
      !Number.isInteger(pid) ||
      pid <= 0
    ) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const cacheKey =
      `cache:product:${pid}`;

    const cached =
      await redisClient.get(
        cacheKey
      );

    if (cached) {
      res.setHeader(
        "X-Cache",
        "HIT"
      );

      return res.status(200).json(
        JSON.parse(cached)
      );
    }

    const response =
      await fetch(
        `${process.env.PRODUCT_SERVICE_URL}/api/products/${pid}`
      );

    const data =
      await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json(data);
    }

    await redisClient.set(
      cacheKey,
      JSON.stringify(data),
      {
        EX: cacheTtlSeconds
      }
    );

    res.setHeader(
      "X-Cache",
      "MISS"
    );

    return res
      .status(200)
      .json(data);
  } catch (error) {
    console.error(
      "Product cache error:",
      error.message
    );

    return next();
  }
}

export async function invalidateProductCache(
  req,
  res,
  next
) {
  try {
    const match =
      req.originalUrl.match(
        /^\/api\/products\/(\d+)/
      );

    if (match) {
      const pid =
        Number(match[1]);

      await redisClient.del(
        `cache:product:${pid}`
      );
    }

    return next();
  } catch (error) {
    console.error(
      "Product cache invalidation error:",
      error.message
    );

    return next();
  }
}