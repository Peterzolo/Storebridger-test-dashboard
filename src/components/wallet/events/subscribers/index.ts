import { Connection } from 'amqplib';
import subCMDWalletCredit from './cmd.wallet.credit';

export default async (connection: Connection): Promise<void> => {
  await subCMDWalletCredit(connection);
};
