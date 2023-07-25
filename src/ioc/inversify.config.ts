import { Container } from 'inversify';
import authModule from '../components/auth/modules';
import userModule from '../components/user/modules';
import notificationModule from '../components/notification/modules';
import contractModule from '../components/contract/modules';
import imageModule from '../components/image/modules';
import orderModule from '../components/order/modules';
import paymentModule from '../components/payment/modules';
import walletModule from '../components/wallet/modules';

export default (): Container => {
  const container = new Container();

  container.load(
    authModule(),
    userModule(),
    notificationModule(),
    contractModule(),
    imageModule(),
    orderModule(),
    paymentModule(),
    walletModule(),
  );

  return container;
};
