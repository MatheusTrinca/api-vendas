import Product from '../infra/typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import { IShowProduct } from '../domain/models/IShowProduct';
import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductRepositories';

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IShowProduct): Promise<Product | undefined> {
    const product = this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    return product;
  }
}

export default ShowProductService;
