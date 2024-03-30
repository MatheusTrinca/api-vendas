import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

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

    const users = await usersRepository.createQueryBuilder().paginate();

    return users;
  }
}

export default ListUsersService;
