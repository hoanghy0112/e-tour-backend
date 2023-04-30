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

export async function setupTestedSocketServer() {
  await connectMongo();
  await runSocketServer();
  await runHttpServer();
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
  const request = supertest(app);
  await UserModel.deleteMany({});
  await StaffModel.deleteMany({});
  const username = 'username';
  const password = 'password';

  let token = '';
  let id = '';
  let response;

  switch (type) {
    case 'client':
      response = await request
        .post('/user/signup/basic')
        .field('username', username)
        .field('password', password)
        .field('fullName', 'full name')
        .field('identity', '00000000')
        .field('isForeigner', false)
        .field('email', 'email@gmail.com')
        .field('address', 'Tay Son');
      token = response.body.data.tokens.accessToken;
      id = response.body.data.user._id;
      break;
    case 'staff':
      response = await request
        .post('/company/signup/basic')
        .field('name', 'congty')
        .field('email', 'congty@gmail.com')
        .field('username', username)
        .field('password', password);
      token = response.body.data.tokens.accessToken;
      break;
  }

  const clientSocket = io(`http://localhost:${process.env.PORT}`, {
    path: '/socket',
    query: {
      type,
      token,
    },
  });

  await new Promise<void>((resolve) => {
    clientSocket.on('connect', () => resolve());
  });

  return {
    socket: clientSocket,
    id,
  };
}
