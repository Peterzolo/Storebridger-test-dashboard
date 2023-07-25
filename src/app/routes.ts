import express from 'express';
import contractRouter from '../components/contract/routes';
import authRouter from '../components/auth/routes';
import userRouter from '../components/user/routes';
import imageRouter from '../components/image/routes';
import orderRouter from '../components/order/routes';
import paymentRouter from '../components/payment/routes';
import walletRouter from '../components/wallet/routes';
import backOfficeRouter from '../backoffice/routes';
import config from '../config';

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).send({ msg: 'Storebridger api running ' });
});
router.use(`${config.api.prefix}/auth`, authRouter);
router.use(`${config.api.prefix}/users`, userRouter);
router.use(`${config.api.prefix}/contracts`, contractRouter);
router.use(`${config.api.prefix}/images`, imageRouter);
router.use(`${config.api.prefix}/orders`, orderRouter);
router.use(`${config.api.prefix}/payments`, paymentRouter);
router.use(`${config.api.prefix}/wallets`, walletRouter);
router.use('/backoffice', backOfficeRouter);

export default router;
