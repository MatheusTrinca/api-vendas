import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  public async findByName(name: string): Promise<User | undefined> {
    const user = this.findOne({
      where: {
        name,
      },
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.findOne({
      where: {
        id,
      },
    })

    return user;
  }

  public findByEmail(email: string): Promise<User | undefined> {
    const user = this.findOne({
      where: {
        email,
      },
    });

    return user;
  }
}

export default UsersRepository;
