import { getCustomRepository } from 'typeorm';
import ProductRepository from '../typeorm/repositories/ProductRepository';
import Product from '../typeorm/entities/Product';

interface IPaginateResponse {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page?: number | undefined | null;
  next_page?: number | undefined | null;
  last_page: number | null;
  data: Product[];
}

class ListProductService {
  public async execute(): Promise<IPaginateResponse> {
    const productsRepository = getCustomRepository(ProductRepository);

    const products = await productsRepository.createQueryBuilder().paginate();

    return products;
  }
}

export default ListProductService;
