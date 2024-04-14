import { Request, Response } from 'express';
import ListCustomerService from '../../../services/ListCustomerService';
import ShowCustomerService from '../../../services/ShowCustomerService';
import CreateCustomerService from '../../../services/CreateCustomerService';
import UpdateCustomerService from '../../../services/UpdateCustomerService';
import DeleteCustomerService from '../../../services/DeleteCustomerService';
import { container } from 'tsyringe';

class CustomersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listCustumerService = container.resolve(ListCustomerService);

    const custumers = await listCustumerService.execute();

    return response.json(custumers);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const showCustumerService = container.resolve(ShowCustomerService);

    const { id } = request.params;

    const custumer = await showCustumerService.execute({ id });

    return response.json(custumer);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createCustumerService = container.resolve(CreateCustomerService);

    const { name, email } = request.body;

    const customer = await createCustumerService.execute({ name, email });

    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateCustomerService = container.resolve(UpdateCustomerService);

    const { id } = request.params;
    const { name, email } = request.body;

    const custumer = await updateCustomerService.execute({ id, name, email });

    return response.json(custumer);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const deleteCustomerService = container.resolve(DeleteCustomerService);

    const { id } = request.params;

    await deleteCustomerService.execute({ id });

    response.json([]);
  }
}

export default CustomersController;
