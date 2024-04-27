import AppError from '@shared/errors/AppError';
import Product from '../infra/typeorm/entities/Product';
import { RedisCache } from '@shared/cache/Redis';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductRepositories';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<Product> {
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await this.productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
