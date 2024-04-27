import { ICreateProduct } from '../models/ICreateProduct';
import { IFindProducts } from '../models/IFindProducts';
import { IProduct } from '../models/IProduct';
import { IProductPaginate } from '../models/IProductPaginate';

export type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export interface IProductsRepository {
  create(data: ICreateProduct): Promise<IProduct>;

  findByName(name: string): Promise<IProduct | undefined>;

  findAll(params: SearchParams): Promise<IProductPaginate>;

  findById(id: string): Promise<IProduct | undefined>;

  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>;

  remove(product: IProduct): Promise<void>;

  save(product: IProduct): Promise<IProduct>;
}
