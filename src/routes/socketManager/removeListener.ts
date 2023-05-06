import { Socket } from 'socket.io';
import { SocketClientMessage } from '../../types/socket';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import schema from './schema';
import WatchTable from '../../helpers/realtime/WatchTable';
import { SuccessResponse } from '../../core/ApiResponse';

export function handleRemoveListener(socket: Socket) {
  socket.on(
    SocketClientMessage.REMOVE_LISTENER,
    socketAsyncHandler(
      socket,
      socketValidator(schema.removeListener),
      async ({ listenerId }: { listenerId: string }) => {
        WatchTable.removeListener(listenerId);

        return new SuccessResponse('Successfully remove listener', {
          listenerId,
        }).sendSocket(socket);
      },
    ),
  );
}
