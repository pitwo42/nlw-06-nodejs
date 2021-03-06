import { User } from "@entities/User";
import { UsersRepositories } from "@repositories/UsersRepositories";
import { BadRequest } from "@utils/errors";
import { hash } from "bcryptjs";
import { getCustomRepository } from "typeorm";

interface IUserRequest {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
}

class CreateUserService {
  async execute({
    name,
    email,
    password,
    admin = false,
  }: IUserRequest): Promise<User> {
    const userRepository = getCustomRepository(UsersRepositories);

    if (!email) {
      throw new BadRequest("Email cannot be empty");
    }

    if (!password) {
      throw new BadRequest("Password cannot be empty");
    }

    const userAlreadyExists = await userRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      throw new BadRequest("User already exists");
    }

    const passwordHash = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: passwordHash,
      admin,
    });

    await userRepository.save(user);

    return user;
  }
}

export { CreateUserService };
