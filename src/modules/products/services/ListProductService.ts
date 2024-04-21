import { getCustomRepository } from 'typeorm';
import ProductRepository from '../infra/typeorm/repositories/ProductRepository';
import Product from '../infra/typeorm/entities/Product';
import { RedisCache } from '@shared/cache/Redis';

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

    const redisCache = new RedisCache();

    let products = await redisCache.recover<IPaginateResponse>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await productsRepository.createQueryBuilder().paginate();

      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return products;
  }
}

export default ListProductService;
