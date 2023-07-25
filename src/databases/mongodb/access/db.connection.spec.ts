import 'reflect-metadata';
import { logger } from '../../../library/helpers';
import { DbConnection } from './db.connection';

describe('DB Connection', () => {
  it('connect called', async () => {
    const mockSpy = jest.spyOn(DbConnection, 'connect');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockSpy.mockImplementation((_connStr: string) => {
      return Promise.resolve(logger.info(`>>>>> DB is Connected <<<<<<`));
    });
    await DbConnection.initConnection();

    expect(mockSpy).toHaveBeenCalled();
  });
});
