import { ICreateOrder } from '../models/ICreateOrder';
import { IOrder } from '../models/IOrder';
import { IOrderPaginate } from '../models/IOrderPaginate';
import { IShowOrder } from '../models/IShowOrder';

export type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export interface IOrdersRepository {
  findById({ id }: IShowOrder): Promise<IOrder | undefined>;
  findAll({ page, skip, take }: SearchParams): Promise<IOrderPaginate>;
  create(data: ICreateOrder): Promise<IOrder>;
}
