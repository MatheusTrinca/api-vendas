import { RedisCache } from '@shared/cache/Redis';
import { IProductPaginate } from '../domain/models/IProductPaginate';
import { IProductsRepository } from '../domain/repositories/IProductRepositories';
import { inject, injectable } from 'tsyringe';

interface SearchParams {
  page: number;
  limit: number;
}

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    page,
    limit,
  }: SearchParams): Promise<IProductPaginate> {
    const take = limit;
    const skip = (page - 1) * limit;

    const redisCache = new RedisCache();

    let products = await redisCache.recover<IProductPaginate>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await this.productsRepository.findAll({ page, skip, take });

      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return products;
  }
}

export default ListProductService;
