import bcrypt from "bcryptjs";
import { User } from "../../domain/entities/User.js";

export class RegisterUser {
  constructor(userRepository, roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async execute({
    username,
    password,
    email,
    phone
  }) {
    const existingUsername =
      await this.userRepository.findByUsername(username);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const existingEmail =
      await this.userRepository.findByEmail(email);

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const customerRole =
      await this.roleRepository.findByName("CUSTOMER");

    if (!customerRole) {
      throw new Error("CUSTOMER role not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      phone,
      roleid: customerRole.roleid
    });

    const createdUser =
      await this.userRepository.create(user);

    return {
      uid: createdUser.uid,
      username: createdUser.username,
      email: createdUser.email,
      phone: createdUser.phone,
      role: createdUser.role.rolename
    };
  }
}