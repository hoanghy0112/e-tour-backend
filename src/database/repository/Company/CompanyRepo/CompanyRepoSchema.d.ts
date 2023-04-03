import { Company } from '@model/Company/Company';
import { Staff } from '@model/Company/Staff';
import { Types } from 'mongoose';

declare interface createParameter {
  company: Company;
  username: string;
  password: string;
}

declare interface findByIdParameter {
  id: string | Types.ObjectId;
}

declare interface createReturn {
  createdCompany: Company;
  createdAdmin: Staff;
}
