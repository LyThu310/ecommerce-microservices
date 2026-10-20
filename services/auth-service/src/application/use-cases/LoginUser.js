import bcrypt from "bcryptjs";

export class LoginUser {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute({ username, password }) {
    const user =
      await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const passwordMatch =
      await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid username or password");
    }

    const accessToken = this.tokenService.generate({
      uid: user.uid,
      role: user.role.rolename
    });

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    };
  }
}