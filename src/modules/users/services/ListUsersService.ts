import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import { RedisCache } from '@shared/cache/Redis';
import { IUserPaginate } from '../domain/models/IUserPaginate';
import { inject, injectable } from 'tsyringe';

type SearchParams = {
  page: number;
  limit: number;
};

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({ page, limit }: SearchParams): Promise<IUserPaginate> {
    const take = limit;
    const skip = (page - 1) * limit;

    const redisCache = new RedisCache();

    let users = await redisCache.recover<IUserPaginate>('api-vendas-USER_LIST');

    if (!users) {
      users = await this.usersRepository.findAll({ page, skip, take });

      await redisCache.save('api-vendas-USER_LIST', users);
    }

    return users;
  }
}

export default ListUsersService;
