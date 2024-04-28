import { Repository, getRepository } from 'typeorm';
import User from '../entities/User';
import {
  IUsersRepository,
  SearchParams,
} from '@modules/users/domain/repositories/IUsersRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUserPaginate } from '@modules/users/domain/models/IUserPaginate';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(data: ICreateUser): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IUserPaginate> {
    const [users, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      per_page: take,
      total: count,
      current_page: page,
      data: users,
    };
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  public findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }
}

export default UsersRepository;
