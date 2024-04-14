import { Repository, getRepository } from 'typeorm';
import Customer from '../entities/Customer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ICreateCostumer } from '@modules/customers/domain/models/ICreateCustumer';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { IPaginateResponse } from '@modules/customers/domain/repositories/IPaginateResponse';

class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async create(data: ICreateCostumer): Promise<ICustomer> {
    const costumer = this.ormRepository.create(data);

    await this.ormRepository.save(costumer);

    return costumer;
  }

  public async save(costumer: ICustomer): Promise<ICustomer> {
    const custumer = await this.ormRepository.save(costumer);

    return custumer;
  }

  public async remove(customer: ICustomer): Promise<void> {
    await this.ormRepository.remove(customer);
  }

  public async findAll(): Promise<IPaginateResponse> {
    const customers = await this.ormRepository.createQueryBuilder().paginate();

    return customers;
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return customer;
  }
}

export default CustomersRepository;
