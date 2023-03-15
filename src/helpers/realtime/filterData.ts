import { Model } from 'mongoose';

type FilterFunction = (newData: any) => boolean;

const filterData =
  (table: Model<any>, filterFunc: FilterFunction) => (data: any) => {
    //
  };
