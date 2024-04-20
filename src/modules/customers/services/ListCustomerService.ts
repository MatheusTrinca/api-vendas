import Customer from '../infra/typeorm/entities/Customer';
import { RedisCache } from '@shared/cache/Redis';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { ICustomerPaginate } from '../domain/models/ICustomerPaginate';
@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<ICustomerPaginate> {
    const redisCache = new RedisCache();

    let customers = await redisCache.recover<ICustomerPaginate>(
      'api-vendas-CUSTOMER_LIST',
    );

    if (!customers) {
      customers = await this.customersRepository.findAll();

      await redisCache.save('api-vendas-CUSTOMER_LIST', customers);
    }

    return customers;
  }
}

export default ListCustomerService;
