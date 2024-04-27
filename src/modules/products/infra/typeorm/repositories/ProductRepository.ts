import { Repository, In, getRepository } from 'typeorm';
import Product from '../entities/Product';
import {
  IProductsRepository,
  SearchParams,
} from '@modules/products/domain/repositories/IProductRepositories';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IFindProducts } from '@modules/products/domain/models/IFindProducts';
import { IProductPaginate } from '@modules/products/domain/models/IProductPaginate';

class ProductRepository implements IProductsRepository {
  private ormRepository: Repository<IProduct>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async findByName(name: string): Promise<IProduct | undefined> {
    const product = this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findById(id: string): Promise<IProduct | undefined> {
    const product = await this.ormRepository.findOne(id);

    return product;
  }

  public async findAllByIds(products: IFindProducts[]): Promise<IProduct[]> {
    const productsIds = products.map(product => product.id);

    const existsProducts = await this.ormRepository.find({
      where: {
        id: In(productsIds),
      },
    });

    return existsProducts;
  }

  public async remove(product: IProduct): Promise<void> {
    await this.ormRepository.remove(product);
  }

  save(product: IProduct): Promise<IProduct> {
    return this.ormRepository.save(product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IProductPaginate> {
    const [products, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: products,
    };

    return result;
  }
}

export default ProductRepository;
