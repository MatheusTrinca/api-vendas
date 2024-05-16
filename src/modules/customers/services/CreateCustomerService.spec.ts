import AppError from '@shared/errors/AppError';
import { FakeCustomersRepository } from '../domain/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';

describe('CreateCustomerService', () => {
  let fakeCustomerRepository: FakeCustomersRepository;
  let createCustomerService: CreateCustomerService;

  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomersRepository();
    createCustomerService = new CreateCustomerService(fakeCustomerRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomerService.execute({
      name: 'John Doe',
      email: 'pH5Qs@example.com',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create a new customer with same email', async () => {
    await createCustomerService.execute({
      name: 'John Doe',
      email: 'pH5Qs@example.com',
    });

    expect(
      createCustomerService.execute({
        name: 'John Doe',
        email: 'pH5Qs@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
