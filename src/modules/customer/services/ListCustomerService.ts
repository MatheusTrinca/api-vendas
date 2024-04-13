import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
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
  data: Customer[];
}

class ListCustomerService {
  public async execute(): Promise<IPaginateResponse> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const redisCache = new RedisCache();

    let customers = await redisCache.recover<IPaginateResponse>(
      'api-vendas-CUSTOMER_LIST',
    );

    if (!customers) {
      customers = await customersRepository.createQueryBuilder().paginate();

      await redisCache.save('api-vendas-CUSTOMER_LIST', customers);
    }

    return customers;
  }
}

export default ListCustomerService;
