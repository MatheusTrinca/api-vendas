import { compare } from "bcryptjs";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  //token: string;
}

class CreateSessionsService {
  public async execute({email, password}: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findByEmail(email);

    if(!user) {
      throw new Error('Incorrect email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched) {
      throw new Error('Incorrect email/password combination.');
    }

    return {
      user
    }
  }

}

export default CreateSessionsService;
