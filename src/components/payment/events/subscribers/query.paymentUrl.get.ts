import { Message, Connection } from 'amqplib';
import { IPaymentInitiate, IPaymentService } from '../../../../types/payment';
import inversifyContainer from '../../../../ioc/inversify.config';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { PAYMENT_SERVICE } from '../../services';

const container = inversifyContainer();
const paymentService = container.get<IPaymentService>(PAYMENT_SERVICE);
const exchangeName: EventName = 'query.paymentUrl.get';
const queueName: EventName = 'query.paymentUrl.get';
const pattern: EventName = 'query.paymentUrl.get';

const subQueryPaymentUrlGet = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });
    channel.bindQueue(assertedQueue.queue, exchangeName, pattern);

    channel.consume(queueName, async (message) => {
      if (message) {
        const paymentInitializationPayload: IPaymentInitiate = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} recieved with this payload ${JSON.stringify(paymentInitializationPayload)}`);

        channel.ack(message as Message);

        const outcome = await paymentService.initiatePayment(paymentInitializationPayload);
        const responseMessage = Buffer.from(JSON.stringify(outcome));
        channel.sendToQueue(message?.properties.replyTo, responseMessage, {
          correlationId: message?.properties.correlationId,
        });
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to QueryPaymentUrlGet from ${queueName}: ${error}`);
  }
};

export default subQueryPaymentUrlGet;
