import { Company, CompanyModel } from '../../../model/Company/Company';
import {
  Staff,
  AdminPermission,
  StaffRole,
  StaffModel,
} from '../../../model/Company/Staff';
import StaffRepo from '../StaffRepo/StaffRepo';
import { createParameter, findByIdParameter } from './CompanyRepoSchema';

export async function create({
  company,
  username,
  password,
}: createParameter): Promise<Company | null> {
  const createdCompany = await CompanyModel.create(company);

  const admin = {
    fullName: 'Administrator',
    role: StaffRole.ADMIN,
    companyId: createdCompany._id,
    permissions: AdminPermission,
  } as Staff;

  const createdAdmin = await StaffRepo.create({
    staff: admin,
    username,
    password,
  });

  return createdCompany;
}

export async function findById({
  id,
}: findByIdParameter): Promise<Company | null> {
  const company = await CompanyModel.findById(id);

  return company;
}
