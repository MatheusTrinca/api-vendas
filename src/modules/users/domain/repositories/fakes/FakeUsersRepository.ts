import User from '@modules/users/infra/typeorm/entities/User';
import { ICreateUser } from '../../models/ICreateUser';
import { IUser } from '../../models/IUser';
import { IUserPaginate } from '../../models/IUserPaginate';
import { IUsersRepository, SearchParams } from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const user = new User();

    user.name = name;
    user.email = email;
    user.password = password;

    this.users.push(user);

    return user;
  }

  public async findAll(params: SearchParams): Promise<any> {
    return {
      ...params,
      data: this.users,
      count: this.users.length,
    };
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByName(name: string): Promise<User | undefined> {
    return this.users.find(user => user.name === name);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async save(user: User): Promise<User> {
    Object.assign(this.users, user);

    return user;
  }
}

export default FakeUsersRepository;
