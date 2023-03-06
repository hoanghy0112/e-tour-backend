import { Company } from '../../../model/Company/Company';
import { Staff } from '../../../model/Company/Staff';

declare interface createParameter {
  company: Company;
  username: string;
  password: string;
}

declare interface findByIdParameter {
  id: string;
}

declare interface createReturn {
  createdCompany: Company;
  createdAdmin: Staff;
}
