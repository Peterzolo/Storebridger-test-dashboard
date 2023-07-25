import express, { Request, Response } from 'express';
import { logger } from '../../library/helpers';
import { FeatureFlagModel } from './Model';

const featureRoute = express.Router();

featureRoute.get('/', async (req, res) => {
  try {
    const featureFlags = await FeatureFlagModel.find();
    res.status(200).send(featureFlags);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

featureRoute.post('/', async (req: Request, res: Response) => {
  try {
    const { name, enabled } = req.body;

    const feature = await FeatureFlagModel.findOne({ name });
    if (!feature) {
      return res.status(404).send('Feature not found');
    }

    feature.enabled = !enabled;
    await feature.save();

    const featureFlags = await FeatureFlagModel.find();

    return res.status(200).send(featureFlags);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default featureRoute;
