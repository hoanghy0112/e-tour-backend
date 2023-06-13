import { Socket } from 'socket.io';
import { handleViewVoucher } from './viewVoucher';
import { handleCreateVoucher } from './createVoucher';

export function handleVoucher(socket: Socket) {
  handleViewVoucher(socket);
  handleCreateVoucher(socket);
}
