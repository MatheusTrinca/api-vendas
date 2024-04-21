import { getCustomRepository } from 'typeorm';
import ProductRepository from '@modules/products/infra/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import { inject, injectable } from 'tsyringe';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IOrder } from '../domain/models/IOrder';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
    //! Adicionar apos a refatoração do Product
    // @inject('ProductRepository')
    // private productRepository: ProductRepository,
  ) {}

  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<IOrder> {
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
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
        `The quantity ${notAvailableQuantity[0].quantity} is not available for the product with id ${notAvailableQuantity[0].id}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updateProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updateProductQuantity);

    //! Colocar o Redis aqui

    return order;
  }
}

export default CreateOrderService;
