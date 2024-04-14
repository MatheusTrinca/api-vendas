import AppError from '@shared/errors/AppError';
import Customer from '../infra/typeorm/entities/Customer';
import { RedisCache } from '@shared/cache/Redis';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('User not found.', 404);
    }

    customer.name = name;
    customer.email = email;

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');

    await this.customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
