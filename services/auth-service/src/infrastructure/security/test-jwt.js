import "dotenv/config";
import jwt from "jsonwebtoken";

const token = process.argv[2];

if (!token) {
  console.error("JWT token is required.");
  process.exit(1);
}

try {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );

  console.log("JWT verified successfully.");
  console.log("sub:", decoded.sub);
  console.log("role:", decoded.role);
  console.log("iat:", decoded.iat);
  console.log("exp:", decoded.exp);
  console.log(
    "Expires in seconds:",
    decoded.exp - decoded.iat
  );
} catch (error) {
  console.error("JWT verification failed:", error.message);
}