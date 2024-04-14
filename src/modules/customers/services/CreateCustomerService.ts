import AppError from '@shared/errors/AppError';
import { RedisCache } from '@shared/cache/Redis';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { inject, injectable } from 'tsyringe';
import { ICustomer } from '../domain/models/ICustomer';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<ICustomer> {
    const emailExists = await this.customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email already exists.', 404);
    }

    const customer = this.customersRepository.create({
      name,
      email,
    });

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');

    return customer;
  }
}

export default CreateCustomerService;
