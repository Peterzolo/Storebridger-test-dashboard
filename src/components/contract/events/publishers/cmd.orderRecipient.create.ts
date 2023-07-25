import amqlib from 'amqplib';
import config from '../../../../config/index';
import { ICreateRecipient } from '../../../../types/order';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const exchangeName: EventName = 'cmd.orderRecipient.create';
const queueName: EventName = 'cmd.orderRecipient.create';
const routingKey: EventName = 'cmd.orderRecipient.create';

const pubCMDOrderRecipientCreate = async (orderRecipientPayload: ICreateRecipient) => {
  try {
    if (!orderRecipientPayload)
      throw new BadRequestError('Order recipient data is required for the recipient creation');

    const connection = await amqlib.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const message = Buffer.from(JSON.stringify(orderRecipientPayload));
    logger.info(`order recipient create message command prepared: ${message}`);
    channel.publish(exchangeName, routingKey, message);

    setTimeout(() => {
      connection.close();
    }, config.rabbitMQ.closeConnectionTimeout);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubCMDOrderRecipientCreate;
