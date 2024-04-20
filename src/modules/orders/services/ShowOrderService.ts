import { getCustomRepository } from 'typeorm';
import OrdersRepository from '../infra/typeorm/repositories/OrdersRepository';
import AppError from '@shared/errors/AppError';
import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  id: string;
}

class ShowOrderService {
  public async execute({ id }: IRequest): Promise<Order | undefined> {
    const ordersRepository = getCustomRepository(OrdersRepository);

    const order = await ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }
}

export default ShowOrderService;
