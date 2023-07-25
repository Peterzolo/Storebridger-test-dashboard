/* eslint-disable no-console */
import mongoose from 'mongoose';
import { logger } from '../../../../library/helpers';
import { ContractCategory } from '../ContractCategory';
import { ContractCategoriesList } from './contractCategoryCatalog';

async function seedData() {
  logger.info('Creating contract categories ....');
  await ContractCategory.deleteMany({});
  await ContractCategory.insertMany(ContractCategoriesList);

  return { done: true };
}
function seedContractCategory() {
  seedData()
    .then((status) => {
      if (status.done) {
        setTimeout(() => {
          logger.info('Contract Categories Created');
          mongoose.connection.close();
        }, 10000);
      }
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
    });
}

export default seedContractCategory;
