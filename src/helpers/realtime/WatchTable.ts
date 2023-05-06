import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { v4 } from 'uuid';

type FilterFunction = <T>(data: any) => boolean;
type CallbackFunction = <T>(data: any, listenerId: string) => void;

interface TableElement {
  filters: FilterFunction[];
  callbacks: CallbackFunction[];
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

  static execute(model: Model<any>, data: any) {
    const normalizedCollectionName = model.modelName.toLowerCase();

    WatchTable.table.forEach(({ filters, callbacks, modelName }, id) => {
      if (modelName !== normalizedCollectionName) return;
      if (filters?.every((func) => func(data))) {
        callbacks.forEach((func) => func(data, id));
      }
    });
  }
}
