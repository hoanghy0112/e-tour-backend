import { Staff } from '@model/Company/Staff';

declare interface createParameter {
  staff: Staff;
  username: string;
  password: string;
}

declare interface findByUsernameParameter {
  username: string;
}
