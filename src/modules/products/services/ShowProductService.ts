import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import ProductRepository from '../infra/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

class ShowProductService {
  public async execute({ id }: IRequest): Promise<Product | undefined> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    return product;
  }
}

export default ShowProductService;
