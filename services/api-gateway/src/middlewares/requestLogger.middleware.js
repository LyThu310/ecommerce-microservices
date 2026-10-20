export function requestLogger(
  req,
  res,
  next
) {
  const startedAt =
    process.hrtime.bigint();

  res.on(
    "finish",
    () => {
      const endedAt =
        process.hrtime.bigint();

      const durationMs =
        Number(
          endedAt - startedAt
        ) / 1_000_000;

      const uid =
        req.user?.uid ?? "-";

      const role =
        req.user?.role ?? "-";

      console.log(
        [
          "[REQUEST]",
          req.method,
          req.originalUrl,
          res.statusCode,
          `${durationMs.toFixed(2)}ms`,
          `ip=${req.ip}`,
          `uid=${uid}`,
          `role=${role}`
        ].join(" ")
      );
    }
  );

  next();
}