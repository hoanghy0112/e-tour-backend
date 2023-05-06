import { Socket } from 'socket.io';
import { SocketClientMessage } from '../../types/socket';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import schema from './schema';
import WatchTable from '../../helpers/realtime/WatchTable';
import { SuccessResponse } from '../../core/ApiResponse';

export function handleTestWatchTable(socket: Socket) {
  socket.on(
    SocketClientMessage.TEST_WATCHTABLE,
    socketAsyncHandler(socket, async () => {
      const tableSize = WatchTable.getTableSize();

      return new SuccessResponse('Successfully retrieve table size', {
        tableSize,
      }).sendSocket(socket);
    }),
  );
}
