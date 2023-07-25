import { Connection } from 'amqplib';
import subCMDOrderRecipientCreate from './cmd.orderRecipient.create';

export default async (connection: Connection): Promise<void> => {
  await subCMDOrderRecipientCreate(connection);
};
