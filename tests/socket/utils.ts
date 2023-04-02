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

export async function getSocketInstance(
  type: 'client' | 'staff',
): Promise<Socket> {
  const request = supertest(app);
  await UserModel.remove({});
  await StaffModel.remove({});
  const username = 'username';
  const password = 'password';

  let token = '';
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
        .field('email', 'email@gmail.com');
      token = response.body.data.tokens.accessToken;
      break;
    case 'staff':
      response = await request
        .post('/company/signup/basic')
        .field('name', v4())
        .field('email', 'fasdfa@gmail.com')
        .field('username', username)
        .field('password', password);
      token = response.body.data.tokens.accessToken;
      break;
  }

  const clientSocket = io(`http://localhost:3000`, {
    path: '/socket',
    query: {
      type,
      token,
    },
  });

  await new Promise<void>((resolve) => {
    clientSocket.on('connect', () => resolve());
  });

  return clientSocket;
}