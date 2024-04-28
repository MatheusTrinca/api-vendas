import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import { RedisCache } from '@shared/cache/Redis';
import { IUdpdateAvatar } from '../domain/models/IUdpdateAvatar';
import { inject, injectable } from 'tsyringe';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    // @inject('RedisCache')
    // private redisCache: RedisCache
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IUdpdateAvatar): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-USER_LIST');

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
