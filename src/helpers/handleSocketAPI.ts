import { Socket } from 'socket.io';
import socketAsyncHandler from './socketAsyncHandler';

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
  socket.on(clientEvent, socketAsyncHandler(socket, schema, handler));
}
