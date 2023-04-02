import WatchTable from '../../../src/helpers/realtime/WatchTable';
import UserModel from '../../../src/database/model/User/User';
import { connectMongo, connection } from '../../../src/database';
import { v4 } from 'uuid';

describe('WatchTable', () => {
  beforeAll(async () => {
    await connectMongo();
    await UserModel.findOneAndUpdate(
      {
        email: 'asdfa@gmail.com',
      },
      {
        fullName: '___',
        identity: 'test-hy',
        email: 'asdfa@gmail.com',
      },
      { upsert: true },
    );
  });

  afterAll(async () => {
    connection.close();
  });

  test('Should call callback function with always-true function', async () => {
    const response = (await new Promise(async (resolve, reject) => {
      WatchTable.register(UserModel)
        .filter(() => true)
        .do((data) => {
          console.log({ data });
          resolve(data);
        });

      await UserModel.findOneAndUpdate(
        {
          email: 'asdfa@gmail.com',
        },
        {
          fullName: v4(),
          identity: 'testing-hy',
          email: 'asdfa@gmail.com',
        },
        { upsert: true },
      );
    })) as any;
    console.log({ response });

    expect(response.identity).toBe('testing-hy');
  }, 15000);
});
