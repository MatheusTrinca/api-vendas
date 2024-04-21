import { Request, Response } from 'express';
import CreateOrderService from '@modules/orders/services/CreateOrderService';
import ShowOrderService from '@modules/orders/services/ShowOrderService';
import ListOrderService from '@modules/orders/services/ListOrderService';
import { container } from 'tsyringe';

class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createOrderService = container.resolve(CreateOrderService);

    const { customer_id, products } = request.body;

    const order = await createOrderService.execute({ customer_id, products });

    return response.json(order);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const showOrderService = container.resolve(ShowOrderService);

    const { id } = request.params;

    const order = await showOrderService.execute({ id });

    return response.json(order);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 15;

    const listOrderService = container.resolve(ListOrderService);

    const orders = await listOrderService.execute({ page, limit });

    return response.json(orders);
  }
}

export default OrdersController;
