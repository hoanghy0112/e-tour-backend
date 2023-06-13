import { Socket } from 'socket.io';
import { handleViewVoucher } from './viewVoucher';
import { handleCreateVoucher } from './voucher';

export function handleVoucher(socket: Socket) {
  handleViewVoucher(socket);
  handleCreateVoucher(socket);
}
