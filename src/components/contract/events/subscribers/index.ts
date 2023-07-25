import { Connection } from 'amqplib';
import subQueryContractGet from './query.contract.get';
import subCMDContractContentTemplateCreate from './cmd.contractContentTemplate.create';

export default async (connection: Connection): Promise<void> => {
  await subQueryContractGet(connection);
  await subCMDContractContentTemplateCreate(connection);
};
