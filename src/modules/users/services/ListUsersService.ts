import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import { RedisCache } from '@shared/cache/Redis';

interface IPaginateResponse {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page?: number | undefined | null;
  next_page?: number | undefined | null;
  last_page: number | null;
  data: User[];
}

class ListUsersService {
  public async execute(): Promise<IPaginateResponse> {
    const usersRepository = getCustomRepository(UsersRepository);

    const redisCache = new RedisCache();

    let users = await redisCache.recover<IPaginateResponse>(
      'api-vendas-USER_LIST',
    );

    if (!users) {
      users = await usersRepository.createQueryBuilder().paginate();

      await redisCache.save('api-vendas-USER_LIST', users);
    }

    return users;
  }
}

export default ListUsersService;
