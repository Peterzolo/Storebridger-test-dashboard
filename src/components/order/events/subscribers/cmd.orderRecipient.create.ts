import { Message, Connection } from 'amqplib';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { ORDER_SERVICE } from '../../services';
import inversifyContainer from '../../../../ioc/inversify.config';
import { ICreateRecipient, IOrderService } from '../../../../types/order';

const container = inversifyContainer();
const orderService = container.get<IOrderService>(ORDER_SERVICE);
const exchangeName: EventName = 'cmd.orderRecipient.create';
const queueName: EventName = 'cmd.orderRecipient.create';
const pattern: EventName = 'cmd.orderRecipient.create';

const subCMDOrderRecipientCreate = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });
    channel.bindQueue(assertedQueue.queue, exchangeName, pattern);

    channel.consume(queueName, async (message) => {
      if (message) {
        const orderRecipientPayload: ICreateRecipient = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(orderRecipientPayload)}`);

        channel.ack(message as Message);

        const outcome = await orderService.createRecipient(orderRecipientPayload);
        logger.info(`Order recipient created: ${JSON.stringify(outcome)}`);
      } else {
        logger.info(`${exchangeName} received with no message`);
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to ${exchangeName} from ${queueName}: ${error}`);
  }
};

export default subCMDOrderRecipientCreate;
