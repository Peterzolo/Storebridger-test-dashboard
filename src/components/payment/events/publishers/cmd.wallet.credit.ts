import amqplib from 'amqplib';
import config from '../../../../config';
import { ICreditWallet } from '../../../../types/wallet';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const exchangeName: EventName = 'cmd.wallet.credit';
const queueName: EventName = 'cmd.wallet.credit';
const routingKey: EventName = 'cmd.wallet.credit';

const pubCMDWalletCredit = async (walletPayload: ICreditWallet) => {
  logger.info(`pub cmd wallet creidt payload: ${JSON.stringify(walletPayload)}`);
  try {
    if (!walletPayload) throw new BadRequestError('Wallet data is required');

    const connection = await amqplib.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const message = Buffer.from(JSON.stringify(walletPayload));
    logger.info(`wallet credit message command prepared: ${message}`);
    channel.publish(exchangeName, routingKey, message);

    setTimeout(() => {
      connection.close();
    }, config.rabbitMQ.closeConnectionTimeout);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubCMDWalletCredit;
