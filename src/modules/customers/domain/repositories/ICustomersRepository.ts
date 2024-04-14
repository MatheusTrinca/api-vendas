import { ICustomer } from '../models/ICustomer';
import { ICreateCostumer } from '../models/ICreateCustumer';
import { IPaginateResponse } from './IPaginateResponse';

export interface ICustomersRepository {
  create(data: ICreateCostumer): Promise<ICustomer>;

  save(customer: ICustomer): Promise<ICustomer>;

  remove(customer: ICustomer): Promise<void>;

  findAll(): Promise<IPaginateResponse>;

  findByName(name: string): Promise<ICustomer | undefined>;

  findById(id: string): Promise<ICustomer | undefined>;

  findByEmail(email: string): Promise<ICustomer | undefined>;
}
