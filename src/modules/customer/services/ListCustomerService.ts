import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

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

    const customers = await customersRepository.createQueryBuilder().paginate();

    return customers;
  }
}

export default ListCustomerService;
