import { Connection } from 'amqplib';
import subEventUserCreated from './event.user.created';

export default async (connection: Connection): Promise<void> => {
  await subEventUserCreated(connection);
};
