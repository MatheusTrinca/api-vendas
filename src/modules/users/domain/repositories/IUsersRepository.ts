import { ICreateUser } from '../models/ICreateUser';
import { IUser } from '../models/IUser';
import { IUserPaginate } from '../models/IUserPaginate';

export interface SearchParams {
  page: number;
  skip: number;
  take: number;
}

export interface IUsersRepository {
  create(data: ICreateUser): Promise<IUser>;

  findAll(params: SearchParams): Promise<IUserPaginate>;

  findById(id: string): Promise<IUser | undefined>;

  findByName(name: string): Promise<IUser | undefined>;

  findByEmail(email: string): Promise<IUser | undefined>;

  save(user: IUser): Promise<IUser>;
}
