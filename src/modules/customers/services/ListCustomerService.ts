import Customer from '../infra/typeorm/entities/Customer';
import { RedisCache } from '@shared/cache/Redis';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

interface IPaginateResponse {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page?: number | undefined | null;
  next_page?: number | undefined | null;
  last_page: number | null;
  data: Customer[];
}

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<IPaginateResponse> {
    const redisCache = new RedisCache();

    let customers = await redisCache.recover<IPaginateResponse>(
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
