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

  test.skip('Should call callback function with always-true function', async () => {
    const response = (await new Promise(async (resolve, reject) => {
      WatchTable.register(UserModel)
        .filter(() => true)
        .do((data) => {
          resolve(data);
        });

      console.log(await UserModel.find({}));
      UserModel.watch().on('change', (data) => {
        console.log({ data });
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
      console.log(await UserModel.find({}));
    })) as any;

    expect(response.identity).toBe('testing-hy');
  }, 15000);
});
