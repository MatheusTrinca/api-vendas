import { RedisCache } from '@shared/cache/Redis';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { ICustomerPaginate } from '../domain/models/ICustomerPaginate';

interface SearchParams {
  page: number;
  limit: number;
}

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    page,
    limit,
  }: SearchParams): Promise<ICustomerPaginate> {
    const take = limit;
    const skip = (page - 1) * limit;

    const redisCache = new RedisCache();

    let customers = await redisCache.recover<ICustomerPaginate>(
      'api-vendas-CUSTOMER_LIST',
    );

    if (!customers) {
      customers = await this.customersRepository.findAll({ page, skip, take });

      await redisCache.save('api-vendas-CUSTOMER_LIST', customers);
    }

    return customers;
  }
}

export default ListCustomerService;
