import jwt from "jsonwebtoken";

export class JwtTokenService {
  constructor(secret, expiresIn = "1h") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generate({ uid, role }) {
    return jwt.sign(
      {
        role
      },
      this.secret,
      {
        subject: String(uid),
        expiresIn: this.expiresIn
      }
    );
  }
}