import { ICompany } from '@model/Company/Company';
import { Staff } from '@model/Company/Staff';
import { Types } from 'mongoose';

declare interface createParameter {
  company: ICompany;
  username: string;
  password: string;
}

declare interface findByIdParameter {
  id: string | Types.ObjectId;
}

declare interface createReturn {
  createdCompany: ICompany;
  createdAdmin: Staff;
}
