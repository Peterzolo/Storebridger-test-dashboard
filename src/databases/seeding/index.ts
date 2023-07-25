import seedFeatureFlags from '../../backoffice/features/createFeatures';
import seedContractCategory from '../../components/contract/models/seeding/seedData';
import config from '../../config';
import mongoose from 'mongoose';
import { logger } from '../../library/helpers';

mongoose
  .connect(config.dbURI || '')
  .then(() => {
    logger.info('Connected to DB');
    seedFeatureFlags();
    seedContractCategory();
  })
  .catch((err) => {
    logger.error(JSON.stringify(err));
    mongoose.connection.close();
  });
