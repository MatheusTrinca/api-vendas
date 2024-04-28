import { IUserToken } from '../models/IUserToken';

export interface IUserTokensRepository {
  generate(user_id: string): Promise<IUserToken>;

  findByToken(token: string): Promise<IUserToken | undefined>;
}
