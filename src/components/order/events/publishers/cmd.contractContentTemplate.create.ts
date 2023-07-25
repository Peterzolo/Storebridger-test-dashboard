import amqplid from 'amqplib';
import config from '../../../../config/index';
import { ICreateContractContentTemplate } from '../../../../types/contract';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const exchangeName: EventName = 'cmd.contractContentTemplate.create';
const queueName: EventName = 'cmd.contractContentTemplate.create';
const routingKey: EventName = 'cmd.contractContentTemplate.create';

const pubCMDContractContentTemplateCreate = async (contractContentTemplatePayload: ICreateContractContentTemplate) => {
  try {
    if (!contractContentTemplatePayload) {
      throw new BadRequestError('ContractContentTemplate data is required for ContractContentTemplate creation');
    }

    const connection = await amqplid.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const message = Buffer.from(JSON.stringify(contractContentTemplatePayload));
    logger.info(`contractContentTemplate create message commad prepared: ${message}`);
    channel.publish(exchangeName, routingKey, message);

    setTimeout(() => {
      connection.close();
    }, config.rabbitMQ.closeConnectionTimeout);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubCMDContractContentTemplateCreate;
