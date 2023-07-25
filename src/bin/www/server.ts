import 'reflect-metadata';
import 'source-map-support/register';

import { Application } from 'express';
// import os from 'os';
// import cluster from 'cluster';
import amqplib from 'amqplib';
import config from '../../config';
import inversifyConfig from '../../ioc/inversify.config';
import applicationConfig from '../../app/app';
import { DbConnection } from '../../databases/mongodb';
import { logger, initializeSocket } from '../../library/helpers';
import bootstrapUserEvents from '../../components/user/events/subscribers';
import bootstrapAuthEvents from '../../components/auth/events/subscribers';
import bootstrapNotificationEvents from '../../components/notification/events/subscribers';
import bootstrapContractEvents from '../../components/contract/events/subscribers';
import bootstrapOrderEvents from '../../components/order/events/subscribers';
import bootstrapPaymentEvents from '../../components/payment/events/subscribers';
import bootstrapWalletEvents from '../../components/wallet/events/subscribers';

// This is commented out pending the time there will be a fix for the clusters and rabbitmq

// if (cluster.isPrimary) {
//   const cpuCoreCount = os.cpus().length;

// // if (cluster.isPrimary) {
//   const cpuCoreCount = os.cpus().length;

//   for (let index = 0; index < cpuCoreCount; index++) {
// //     cluster.fork();
// //   }

//   cluster.on('exit', function (worker) {
//     logger.info(`Worker ${worker.id} died'`);
//     logger.info(`Staring a new one...`);
//     cluster.fork();
//   });
// } else {
initializeServer()
  .then(() => {
    logger.info(`
              ################################################
                ${config.appName} has been initialize
              ################################################
            `);
  })
  .catch((error: Error) => {
    logger.error(error);
    throw error;
  });
// }

async function initializeServer(): Promise<void> {
  inversifyConfig();

  amqplib
    .connect(config.rabbitMQ.host)
    .then(async (connection) => {
      await bootstrapUserEvents(connection);
      await bootstrapAuthEvents(connection);
      await bootstrapNotificationEvents(connection);
      await bootstrapContractEvents(connection);
      await bootstrapOrderEvents(connection);
      await bootstrapPaymentEvents(connection);
      await bootstrapWalletEvents(connection);
    })
    .catch((error: Error) => {
      logger.warn(`**** RabbitMQ server not connected!!! ${JSON.stringify(error)}`);
    });

  const application: Application = applicationConfig();

  await DbConnection.initConnection();

  const serverInstance = application.listen(config.port, '0.0.0.0', () => {
    logger.info(`
      ################################################
        Express Server listening on port: ${config.port}
      ################################################
    `);
  });
  const io = initializeSocket(serverInstance);

  io.on('connection', async (client) => {
    logger.info(`Client connection opened`);

    client.on('disconnect', (event) => logger.info(`Client has disconnected ${event}`));
  });
}
