import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../repositories/OrdersRepository';
import CustomersRepository from '@modules/customer/typeorm/repositories/CustomersRepository';
import ProductRepository from '@modules/products/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';

interface IProduct {
  id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customer = await customerRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Could not find any customer with the given id', 404);
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any product with the given ids', 404);
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
      );
    }

    const notAvailableQuantity = products.filter(
      product =>
        existsProducts.filter(p => product.id === p.id)[0].quantity <
        product.quantity,
    );

    if (notAvailableQuantity.length) {
      throw new AppError(
        `Not available quantity for the product with id ${notAvailableQuantity[0].id}`,
      );
    }
  }
}

export default CreateOrderService;
