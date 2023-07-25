import { Container } from 'inversify';
import authModule from '../components/auth/modules';
import userModule from '../components/user/modules';

export default (): Container => {
  const container = new Container();

  container.load(authModule(), userModule());

  return container;
};
