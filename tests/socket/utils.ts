import { connectMongo, connection } from '../../src/database';
import { runHttpServer, runSocketServer } from '../../src/runServer';
import { Socket, io } from 'socket.io-client';
import socketServer from '../../src/socketServer';
import httpServer from '../../src/httpServer';
import supertest from 'supertest';
import app from '../../src/app';
import { v4 } from 'uuid';
import UserModel from '../../src/database/model/User/User';
import { StaffModel } from '../../src/database/model/Company/Staff';

let clientSocket;
let clientId;

let staffSocket;
let staffId;

export async function setupTestedSocketServer() {
  await connectMongo();
  await runSocketServer();
  await runHttpServer();

  const request = supertest(app);
  await UserModel.deleteMany({});
  await StaffModel.deleteMany({});
  const username = 'username';
  const password = 'password';

  let token = '';
  let id = '';
  let response;

  response = await request
    .post('/user/signup/basic')
    .field('username', username)
    .field('password', password)
    .field('fullName', 'full name')
    .field('identity', '00000000')
    .field('isForeigner', false)
    .field('email', 'email@gmail.com')
    .field('address', 'Tay Son');
  const clientToken = response.body.data.tokens.accessToken;
  clientId = response.body.data.user._id;

  response = await request
    .post('/company/signup/basic')
    .field('name', 'congty')
    .field('email', 'congty@gmail.com')
    .field('username', username)
    .field('password', password);
  staffId = response.body.data.createdAdmin.companyId;
  const staffToken = response.body.data.tokens.accessToken;

  clientSocket = io(`http://localhost:${process.env.PORT}`, {
    path: '/socket',
    query: {
      type: 'client',
      token,
    },
  });

  staffSocket = io(`http://localhost:${process.env.PORT}`, {
    path: '/socket',
    query: {
      type: 'staff',
      token,
    },
  });

  await new Promise<void>((resolve) => {
    clientSocket.on('connect', () => resolve());
  });
}

export async function cleanUpSocketServer() {
  connection.close();
  socketServer.close();
  httpServer.close();
}

export async function getSocketInstance(type: 'client' | 'staff'): Promise<{
  socket: Socket;
  id: string;
}> {
  if (type == 'client') {
    return {
      socket: clientSocket,
      id: clientId,
    };
  }
  return {
    socket: staffSocket,
    id: staffId,
  };
}
