import User from '@modules/users/typeorm/entities/User';
import { hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { RedisCache } from '@shared/cache/Redis';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const userExists = await usersRepository.findByEmail(email);

    if (userExists) {
      throw new Error('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-USER_LIST');

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
