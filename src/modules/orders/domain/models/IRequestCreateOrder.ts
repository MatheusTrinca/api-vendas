import Product from '@modules/products/infra/typeorm/entities/Product';

export interface IRequestCreateOrder {
  customer_id: string;
  //! Mudar para IProduct[] quando criar refatorar e criar a interface IProduct
  products: Product[];
}
