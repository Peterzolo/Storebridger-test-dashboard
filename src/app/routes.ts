import express from 'express';
import authRouter from '../components/auth/routes';
import userRouter from '../components/user/routes';

import backOfficeRouter from '../backoffice/routes';
import config from '../config';

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).send({ msg: 'Storebridger api running ' });
});
router.use(`${config.api.prefix}/auth`, authRouter);
router.use(`${config.api.prefix}/users`, userRouter);

router.use('/backoffice', backOfficeRouter);

export default router;
