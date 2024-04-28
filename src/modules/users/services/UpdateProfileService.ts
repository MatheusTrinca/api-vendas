import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import bcrypt, { hash } from 'bcryptjs';
import { RedisCache } from '@shared/cache/Redis';
import { IUpdateUser } from '../domain/models/IUpdateUser';
import { inject, injectable } from 'tsyringe';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateUser): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userUpdateEmail?.id !== user_id) {
      throw new AppError('There is already one user with this email.', 404);
    }

    if (password && !old_password) {
      throw new AppError('Old password is required.');
    }

    if (password && old_password) {
      const checkOldPassword = await bcrypt.compare(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-USER_LIST');

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
