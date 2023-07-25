/* eslint-disable no-console */
import { logger } from '../../library/helpers';
import { FeatureFlags } from './catalog';
import { FeatureFlagModel } from './Model';
import mongoose from 'mongoose';

async function seedFlags() {
  logger.info('Seeding Feature Flags ....');
  await FeatureFlagModel.deleteMany({});
  await FeatureFlagModel.insertMany(FeatureFlags);

  return { done: true };
}

function seedFeatureFlags() {
  seedFlags()
    .then((status) => {
      logger.info('Feature Flags seeded successfully');
      if (status.done) {
        setTimeout(() => {
          logger.info('Seeding complete');
          mongoose.connection.close();
        }, 10000);
      }
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
    });
}

export default seedFeatureFlags;
