import { Message, Connection } from 'amqplib';
import { ICreditWallet, IWalletService } from '../../../../types/wallet';
import inversifyContainer from '../../../../ioc/inversify.config';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { WALLET_SERVICE } from '../../services';

const container = inversifyContainer();
const walletService = container.get<IWalletService>(WALLET_SERVICE);
const exchangeName: EventName = 'cmd.wallet.credit';
const queueName: EventName = 'cmd.wallet.credit';
const pattern: EventName = 'cmd.wallet.credit';

const subCMDWalletCredit = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });
    channel.bindQueue(assertedQueue.queue, exchangeName, pattern);

    channel.consume(queueName, async (message) => {
      if (message) {
        const walletPayload: ICreditWallet = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(walletPayload)}`);

        channel.ack(message as Message);

        const outcome = await walletService.creditWallet(walletPayload);
        logger.info(`Wallet credited: ${JSON.stringify(outcome)}`);
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to ${exchangeName} from ${queueName}: ${error}`);
  }
};

export default subCMDWalletCredit;
