import User from '@modules/users/typeorm/entities/User';
import { getCustomRepository } from "typeorm";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({name, email, password}: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const userExists = await usersRepository.findByEmail(email);

    if(userExists) {
      throw new Error('Email address already used.');
    }

    const user = usersRepository.create({
      name,
      email,
      password,
    })

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
