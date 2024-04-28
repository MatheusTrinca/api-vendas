import User from '@modules/users/infra/typeorm/entities/User';
import { hash } from 'bcryptjs';
import { RedisCache } from '@shared/cache/Redis';
import { ICreateUser } from '../domain/models/ICreateUser';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUser } from '../domain/models/IUser';

injectable();
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new Error('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-USER_LIST');

    await this.usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
