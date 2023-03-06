import Company, { CompanyInterface } from '../../../model/Company/Company';
import { createParameter, findByIdParameter } from './CompanyRepoSchema';

export async function create({
  company,
  email,
  password,
}: createParameter): Promise<CompanyInterface | null> {
  const createdCompany = await Company.create(company);

  return createdCompany;
}

export async function findById({
  id,
}: findByIdParameter): Promise<CompanyInterface | null> {
  const company = await Company.findById(id);

  return company;
}
