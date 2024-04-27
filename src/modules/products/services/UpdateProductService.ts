import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import ProductRepository from '../infra/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';
import { RedisCache } from '@shared/cache/Redis';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { inject, injectable } from 'tsyringe';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: ProductRepository,
  ) {}

  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    const productExists = await this.productsRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError('There is already a product with this name');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
