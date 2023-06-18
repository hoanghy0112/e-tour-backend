import CompanyModel, { ICompany } from '@model/Company/Company';
import { AdminPermission, Staff, StaffRole } from '@model/Company/Staff';
import { Types } from 'mongoose';
import StaffRepo from '../StaffRepo/StaffRepo';
import { createParameter, createReturn } from './CompanyRepoSchema';

export async function create({
  company,
  username,
  password,
}: createParameter): Promise<createReturn> {
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

  return {
    createdCompany,
    createdAdmin,
  };
}

export async function findById({
  id,
}: {
  id: Types.ObjectId | string;
}): Promise<ICompany | null> {
  const company = await CompanyModel.findById(id);

  return company;
}

const CompanyRepo = {
  create,
  findById,
};

export default CompanyRepo;
