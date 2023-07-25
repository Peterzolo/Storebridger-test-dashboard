import { Router, Request, Response } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schema';
import {
  getBalance,
  postPaymentUrl,
  postDebit,
  getWalletEntries,
  postCreateWallet,
  postCreateWalletBeneficiary,
  getWalletBeneficiaries,
  getWalletStatus,
  postWalletPayment,
  getUpcomingWalletEntries,
} from '../controllers';
import { authenticate, validator } from '../../../library/middlewares';

const walletRouter = Router();

walletRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Wallet module is working on ${process.env.APP_NAME}` };

    return new SuccessResponse('Wallet module health', outcome).send(res);
  }),
);

walletRouter.get('/balance', authenticate, tryCatcher(getBalance));

walletRouter.get('/entries', authenticate, tryCatcher(getWalletEntries));

walletRouter.get('/upcoming', authenticate, tryCatcher(getUpcomingWalletEntries));

walletRouter.get('/status', authenticate, tryCatcher(getWalletStatus));

walletRouter.post('/credit', authenticate, validator(schema.creditWallet), tryCatcher(postPaymentUrl));

walletRouter.post('/debit', authenticate, validator(schema.debitWallet), tryCatcher(postDebit));

walletRouter.post('/create', authenticate, validator(schema.createWallet), tryCatcher(postCreateWallet));

walletRouter.post(
  '/wallet-beneficiaries',
  authenticate,
  validator(schema.verifyAccountNumber),
  tryCatcher(postCreateWalletBeneficiary),
);

walletRouter.get('/wallet-beneficiaries', authenticate, tryCatcher(getWalletBeneficiaries));

walletRouter.post('/payment', authenticate, validator(schema.walletPayment), tryCatcher(postWalletPayment));

export default walletRouter;
