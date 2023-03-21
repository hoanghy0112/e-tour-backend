import { Model } from 'mongoose';
import WatchTable from './WatchTable';

const watch =
  <T>(model: Model<any>) =>
  async (data: any) => {
    // @ts-ignore
    const id = data.documentKey._id;
    const document = await model.findById(id);

    if (document) {
      WatchTable.execute(model, document)
    }
  };

export default watch;
