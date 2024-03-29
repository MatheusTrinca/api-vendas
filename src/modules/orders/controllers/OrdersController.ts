import { Request, Response } from 'express';
import CreateOrderService from '../services/CreateOrderService';
import ShowOrderService from '../services/ShowOrderService';

class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createOrderService = new CreateOrderService();

    const { customer_id, products } = request.body;

    const order = await createOrderService.execute({ customer_id, products });

    return response.json(order);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const showOrderService = new ShowOrderService();

    const { id } = request.params;

    const order = await showOrderService.execute({ id });

    return response.json(order);
  }
}

export default OrdersController;
