import { Company } from '../../../model/Company/Company';

declare interface createParameter {
  company: Company;
  username: string;
  password: string;
}

declare interface findByIdParameter {
  id: string;
}
