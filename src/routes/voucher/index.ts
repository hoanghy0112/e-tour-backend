import { Socket } from 'socket.io';
import express from 'express';
import { handleViewVoucher } from './viewVoucher';
import { handleCreateVoucher } from './createVoucher';
import validator from '../../helpers/validator';
import schema from './schema';
import { removeVoucher, saveVoucher } from './savedVoucher';
import authentication from '../../auth/authentication';

export const voucherRouter = express.Router();

voucherRouter.put(
  '/save',
  authentication.userAuthentication,
  validator(schema.saveVoucher),
  saveVoucher,
);

voucherRouter.delete(
  '/save',
  authentication.userAuthentication,
  validator(schema.saveVoucher),
  removeVoucher,
);

export function handleVoucher(socket: Socket) {
  handleViewVoucher(socket);
  handleCreateVoucher(socket);
}
