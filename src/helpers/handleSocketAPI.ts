import { Socket } from 'socket.io';
import socketAsyncHandler from './socketAsyncHandler';
import socketValidator from './socketValidator';

export default function handleSocketAPI({
  clientEvent,
  serverEvent,
  socket,
  schema,
  handler,
}: {
  clientEvent: string;
  serverEvent?: string;
  socket: Socket;
  schema: any;
  handler: any;
}) {
  socket.on(
    clientEvent,
    socketAsyncHandler(socket, serverEvent || "", socketValidator(schema), handler),
  );
}
