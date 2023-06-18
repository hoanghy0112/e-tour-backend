import { Socket } from 'socket.io';
import socketAsyncHandler from './socketAsyncHandler';
import socketValidator from './socketValidator';
import socketAuthorization from '../auth/socketAuthorization';

export default function handleSocketAPI({
  clientEvent,
  serverEvent,
  socket,
  schema,
  permissions,
  handler,
}: {
  clientEvent: string;
  serverEvent?: string;
  socket: Socket;
  schema?: any;
  permissions?: any;
  handler: any;
}) {
  if (handler instanceof Array) {
  } else {
    handler = [handler];
  }

  socket.on(
    clientEvent,
    socketAsyncHandler(
      socket,
      serverEvent || '',
      schema ? socketValidator(schema) : null,
      permissions ? socketAuthorization(permissions) : null,
      ...handler,
    ),
  );
}
