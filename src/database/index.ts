import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Logger from '@/core/Logger';
import { db } from '@/config';

let dbURI = db.connectionString;
let mongod: MongoMemoryServer;

const options = {
  autoIndex: true,
  minPoolSize: db.minPoolSize, // Maintain up to x socket connections
  maxPoolSize: db.maxPoolSize, // Maintain up to x socket connections
  connectTimeoutMS: 60000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

Logger.debug(dbURI);

function setRunValidators() {
  this.setOptions({ runValidators: true });
}

mongoose.set('strictQuery', true);

export async function connectMongo() {
  if (!dbURI) {
    mongod = await MongoMemoryServer.create();

    dbURI = mongod.getUri();
  }

  // Create the database connection
  return new Promise<void>((resolve, reject) => {
    mongoose
      .plugin((schema: any) => {
        schema.pre('findOneAndUpdate', setRunValidators);
        schema.pre('updateMany', setRunValidators);
        schema.pre('updateOne', setRunValidators);
        schema.pre('update', setRunValidators);
      })
      .connect(dbURI, options)
      .then(() => {
        Logger.info('Mongoose connection done');
        resolve();
      })
      .catch((e) => {
        Logger.info('Mongoose connection error');
        Logger.error(e);
        reject(e);
      });
  });
}

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.debug('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    Logger.info(
      'Mongoose default connection disconnected through app termination',
    );
    process.exit(0);
  });
  if (mongod) await mongod.stop();
});

export const connection = mongoose.connection;
