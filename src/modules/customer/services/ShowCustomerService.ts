import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
}

class ShowCustomerService {
  public async execute({ user_id }: IRequest): Promise<Customer | undefined> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findById(user_id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    return customer;
  }
}

export default ShowCustomerService;
