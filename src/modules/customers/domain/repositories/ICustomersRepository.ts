import { ICustomer } from '../models/ICustomer';
import { ICreateCostumer } from '../models/ICreateCustumer';
import { ICustomerPaginate } from '../models/ICustomerPaginate';

export type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export interface ICustomersRepository {
  create(data: ICreateCostumer): Promise<ICustomer>;

  save(customer: ICustomer): Promise<ICustomer>;

  remove(customer: ICustomer): Promise<void>;

  findAll(params: SearchParams): Promise<ICustomerPaginate>;

  findByName(name: string): Promise<ICustomer | undefined>;

  findById(id: string): Promise<ICustomer | undefined>;

  findByEmail(email: string): Promise<ICustomer | undefined>;
}
