import { Connection } from 'amqplib';
import subQueryPaymentUrlGet from './query.paymentUrl.get';

export default async (connection: Connection): Promise<void> => {
  await subQueryPaymentUrlGet(connection);
};
