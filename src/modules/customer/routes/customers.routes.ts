import { Router } from 'express';
import CustomersController from '../controllers/CustomersController';
import isAuthenticated from '@modules/users/middleware/isAuthenticated';
import { Joi, Segments, celebrate } from 'celebrate';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.use(isAuthenticated);

customersRouter.get('/', customersController.index);

customersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customersController.index,
);

customersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required()
    }
  }),
  customersController.update
)

customersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id:
    }
  })
)

export default customersRouter;
