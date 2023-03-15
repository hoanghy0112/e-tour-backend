import { Model } from 'mongoose';

const watch =
  <T>(table: Model<any>) =>
  async (data: any) => {
    // @ts-ignore
    const id = data.documentKey._id;
    const document = await table.findById(id);

    if (document) {
    }
  };

export default watch;
