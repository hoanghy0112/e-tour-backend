import { CompanyInterface } from '../../../model/Company/Company';

declare interface createParameter {
  company: CompanyInterface;
  email: string;
  password: string;
}

declare interface findByIdParameter {
  id: string;
}
