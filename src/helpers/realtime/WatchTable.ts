import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { v4 } from 'uuid';
import Logger from '../../core/Logger';

type FilterFunction = <T>(
  data: any,
  id: string,
  operationType: IOperationType,
) => boolean;
type CallbackFunction = <T>(
  data: any,
  listenerId: string,
  id: string,
  operationType: IOperationType,
) => void;

interface TableElement {
  filters: FilterFunction[];
  callbacks: CallbackFunction[];
}

export enum IOperationType {
  UPDATE = 'update',
  INSERT = 'insert',
  DELETE = 'delete',
}

export class RegistedCommand {
  private id: string;
  private model: Model<any>;
  private filters: FilterFunction[];
  private callbacks: CallbackFunction[];

  constructor(model: Model<any>, socket: Socket | null) {
    this.model = model;
    this.filters = [];
    this.callbacks = [];
    this.id = v4();

    if (socket)
      socket.on('disconnect', () => {
        WatchTable.removeListener(this.id);
      });
  }

  getId(): string {
    return this.id;
  }

  filter(func: FilterFunction): RegistedCommand {
    this.filters.push(func);
    return this;
  }

  do(func: CallbackFunction): RegistedCommand {
    this.callbacks.push(func);
    WatchTable._setHandler(this.model, this.id, this.filters, this.callbacks);
    return this;
  }
}

export default class WatchTable {
  // key of this map is collection name
  private static table = new Map<
    string,
    {
      filters: FilterFunction[];
      callbacks: CallbackFunction[];
      modelName: string;
    }
  >();

  static register(model: Model<any>, socket: Socket | null) {
    return new RegistedCommand(model, socket);
  }

  static _setHandler(
    model: Model<any>,
    id: string,
    filters: FilterFunction[],
    callbacks: CallbackFunction[],
  ) {
    const normalizedCollectionName = model.modelName.toLowerCase();

    WatchTable.table.set(id, {
      filters,
      callbacks,
      modelName: normalizedCollectionName,
    });
  }

  static removeListener(id: string) {
    WatchTable.table.delete(id);
  }

  static getTableSize() {
    return WatchTable.table.size;
  }

  static execute(
    model: Model<any>,
    data: any,
    documentId: string,
    operationType: IOperationType,
  ) {
    const normalizedCollectionName = model.modelName.toLowerCase();

    WatchTable.table.forEach(
      ({ filters, callbacks, modelName }, listenerId) => {
        if (modelName !== normalizedCollectionName) return;
        try {
          if (filters?.every((func) => func(data, documentId, operationType))) {
            callbacks.forEach((func) =>
              func(data, listenerId, documentId, operationType),
            );
          }
        } catch (e: any) {
          Logger.error(e);
        }
      },
    );
  }
}
