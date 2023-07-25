import { Request, Response, Router } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import { deliveryDetailsController, orderController, orderItemController } from '../controllers';
import { authenticate, validator } from '../../../library/middlewares';

const orderRouter = Router();

orderRouter.get(
  '/health',
  authenticate,
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Order module working on ${process.env.APP_NAME}` };

    return new SuccessResponse('Signup successfull', outcome).send(res);
  }),
);

orderRouter.get('/', authenticate, tryCatcher(orderController.index));
orderRouter.post('/', authenticate, validator(schema.createOrder), tryCatcher(orderController.create));
orderRouter.get('/:id', authenticate, tryCatcher(orderController.read));
orderRouter.put('/:id', authenticate, tryCatcher(orderController.update));
orderRouter.get('/contract/:id', authenticate, tryCatcher(orderController.readByContract));

orderRouter.get('/:id/items', tryCatcher(orderItemController.index));
orderRouter.post('/order-items', authenticate, tryCatcher(orderItemController.create));
orderRouter.put('/order-items/:id', tryCatcher(orderItemController.update));
orderRouter.delete('/order-items/:id', tryCatcher(orderItemController.delete));

orderRouter.get('/delivery-details/index', authenticate, tryCatcher(deliveryDetailsController.index));
orderRouter.get('/:id/delivery-details', authenticate, tryCatcher(deliveryDetailsController.show));
orderRouter.put('/:id/delivery-details', authenticate, tryCatcher(deliveryDetailsController.update));
orderRouter.post(
  '/delivery-details',
  authenticate,
  validator(schema.createDeliveryDetails),
  tryCatcher(deliveryDetailsController.create),
);

orderRouter.put('/:id/edit-role', authenticate, tryCatcher(orderController.editRole));

export default orderRouter;
