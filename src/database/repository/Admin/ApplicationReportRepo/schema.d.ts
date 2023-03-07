import { Company } from '@model/Company/Company';
import { Staff } from '@model/Company/Staff';
import { ApplicationReportInterface } from '@model/Admin/ApplicationReport';

declare interface createParameter {
  title: string;
  description: string;
  image: string;
}

declare interface findByIdParameter {
  id: string;
}

declare interface createReturn {
  createdApplicationReport: ApplicationReportInterface;
}
