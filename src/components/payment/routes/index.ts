import { Router, Request, Response } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import {
  getBanks,
  postAccountNumberVerification,
  postCreatePaymentConfig,
  postInitializePayment,
  postSetDefaultPaymentConfig,
  postVerifyPayment,
} from '../controllers';
import { authenticate, validator } from '../../../library/middlewares';

const paymentRouter = Router();

paymentRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Payment module is working on ${process.env.APP_NAME}` };

    return new SuccessResponse('Payment module health', outcome).send(res);
  }),
);

paymentRouter.post(
  '/payment-config',
  authenticate,
  validator(schema.createPaymentConfig),
  tryCatcher(postCreatePaymentConfig),
);

paymentRouter.post(
  '/set-default-config',
  authenticate,
  validator(schema.setDefaultPaymentConfig),
  tryCatcher(postSetDefaultPaymentConfig),
);

paymentRouter.post('/initialize', authenticate, validator(schema.initiatePayment), tryCatcher(postInitializePayment));

paymentRouter.post('/verify', authenticate, validator(schema.verifyPayment), tryCatcher(postVerifyPayment));

paymentRouter.get('/banks', authenticate, tryCatcher(getBanks));

paymentRouter.post(
  '/verify-account-number',
  authenticate,
  validator(schema.verifyAccountNumber),
  tryCatcher(postAccountNumberVerification),
);

export default paymentRouter;
