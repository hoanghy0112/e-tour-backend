import { Model } from 'mongoose';
import WatchTable, { IOperationType } from './WatchTable';
import { InternalError } from '../../core/ApiError';

const watch =
  <T>(model: Model<any>) =>
  async (data: any) => {
    console.log({ data });
    const id = data.documentKey._id.toString();
    const operationType = data.operationType as IOperationType;
    if (!id) throw new InternalError('id not found');

    let document = null;
    if (operationType == IOperationType.INSERT) {
      document = data.fullDocument;
    } else if (operationType == IOperationType.UPDATE) {
      document = await model.findOne({ _id: id });
    }

    WatchTable.execute(model, document, id, operationType);
  };

export default watch;
