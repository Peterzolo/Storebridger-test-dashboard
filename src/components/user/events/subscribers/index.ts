import { Connection } from 'amqplib';
import subCMDUserCreate from './cmd.user.create';
import subQueryUserGet from './query.user.get';

export default async (connection: Connection): Promise<void> => {
  await subQueryUserGet(connection);
  await subCMDUserCreate(connection);
};
