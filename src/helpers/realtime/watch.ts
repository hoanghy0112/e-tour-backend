import { Model } from 'mongoose';
import WatchTable from './WatchTable';
import { InternalError } from '../../core/ApiError';
import Logger from '../../core/Logger';

const watch =
  <T>(model: Model<any>) =>
  async (data: any) => {
    const id = data.documentKey._id.toString();
    if (!id) throw new InternalError('id not found');

    try {
      const document = await model.findOne({ _id: id });
      console.log({ document });

      if (document) {
        WatchTable.execute(model, document);
      }
    } catch (err) {}
  };

export default watch;
