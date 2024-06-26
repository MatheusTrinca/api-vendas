import { Router } from 'express';
import OrdersController from '../controllers/OrdersController';
import { Joi, Segments, celebrate } from 'celebrate';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';

const ordersRouter = Router();

const ordersController = new OrdersController();

ordersRouter.use(isAuthenticated);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required(),
    },
  }),
  ordersController.create,
);

ordersRouter.get('/', ordersController.index);

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ordersController.show,
);

export default ordersRouter;
