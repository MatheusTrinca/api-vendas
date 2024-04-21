import OrdersRepository from '../infra/typeorm/repositories/OrdersRepository';
import { IOrderPaginate } from '../domain/models/IOrderPaginate';
import { inject, injectable } from 'tsyringe';

interface SearchParams {
  page: number;
  limit: number;
}

@injectable()
class ListOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: OrdersRepository,
  ) {}

  public async execute({ page, limit }: SearchParams): Promise<IOrderPaginate> {
    const take = limit;
    const skip = (page - 1) * limit;

    //! Colocar o Redis Aqui

    const orders = await this.ordersRepository.findAll({ page, skip, take });

    return orders;
  }
}

export default ListOrderService;
