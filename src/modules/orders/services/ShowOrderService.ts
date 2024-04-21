import OrdersRepository from '../infra/typeorm/repositories/OrdersRepository';
import AppError from '@shared/errors/AppError';
import Order from '../infra/typeorm/entities/Order';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  id: string;
}
@injectable()
class ShowOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: OrdersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    const order = await this.ordersRepository.findById({ id });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }
}

export default ShowOrderService;
