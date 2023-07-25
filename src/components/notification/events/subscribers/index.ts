import { Connection } from 'amqplib';
import subEventEmailSent from './event.email.sent';
import subCMDEmailSend from './cmd.email.send';
import subEventSmsSent from './event.sms.sent';
import subCMDSmsSend from './cmd.sms.send';

export default async (connection: Connection): Promise<void> => {
  await subCMDEmailSend(connection);
  await subEventEmailSent(connection);
  await subCMDSmsSend(connection);
  await subEventSmsSent(connection);
};
