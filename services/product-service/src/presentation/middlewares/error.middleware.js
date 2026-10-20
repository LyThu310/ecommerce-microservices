export function notFoundHandler(req, res) {
  return res.status(404).json({
    message: "Route not found"
  });
}

export function errorHandler(
  err,
  req,
  res,
  next
) {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      message: "Invalid JSON"
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    message: "Internal server error"
  });
}