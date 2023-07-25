import express from 'express';
import featureRouter from '../features/routes';

const router = express.Router();

router.use('/features', featureRouter);

export default router;
