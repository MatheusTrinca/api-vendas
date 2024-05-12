import { ICreateCostumer } from '@modules/customers/domain/models/ICreateCustumer';
import { ICustomerPaginate } from '@modules/customers/domain/models/ICustomerPaginate';
import { ICustomersRepository, SearchParams } from '../ICustomersRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { v4 as uuidv4 } from 'uuid';

export class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCostumer): Promise<Customer> {
    const customer = new Customer();

    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    Object.assign(this.customers, customer);

    return customer;
  }

  public async remove(customer: Customer): Promise<void> {
    const customerIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers.splice(customerIndex, 1);
  }

  public async findAll(params: SearchParams): Promise<any> {
    return {
      ...params,
      data: this.customers,
      count: this.customers.length,
    };
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.name === name);
  }

  public async findById(id: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.id === id);
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.email === email);
  }
}
