import { Socket } from 'socket.io';
import socketAsyncHandler from './socketAsyncHandler';
import socketValidator from './socketValidator';

export default function handleSocketAPI({
  clientEvent,
  socket,
  schema,
  handler,
}: {
  clientEvent: string;
  socket: Socket;
  schema: any;
  handler: any;
}) {
  socket.on(
    clientEvent,
    socketAsyncHandler(socket, socketValidator(schema), handler),
  );
}
