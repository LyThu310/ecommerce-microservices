import {
  registerSchema,
  loginSchema
} from "../validators/auth.schemas.js";

export class AuthController {
  constructor(registerUser, loginUser) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
  }

  register = async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: parsed.error.flatten()
        });
      }

      const result = await this.registerUser.execute(parsed.data);

      return res.status(201).json({
        message: "Register successfully",
        data: result
      });
    } catch (error) {
      if (
        error.message === "Username already exists" ||
        error.message === "Email already exists"
      ) {
        return res.status(409).json({
          message: error.message
        });
      }

      console.error("Register controller error:", error);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  login = async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: parsed.error.flatten()
        });
      }

      const result = await this.loginUser.execute(parsed.data);

      return res.status(200).json({
        message: "Login successfully",
        data: result
      });
    } catch (error) {
      if (error.message === "Invalid username or password") {
        return res.status(401).json({
          message: error.message
        });
      }

      console.error("Login controller error:", error);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
}