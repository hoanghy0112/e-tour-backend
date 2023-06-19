import express from 'express';

import multer from 'multer';
import authorization from '../../auth/authorization';
import { StaffPermission } from '../../database/model/Company/Staff';
import validator from '../../helpers/validator';
import companyLogin from './login';
import schema from './schema';
import companySignup from './signup';
import { viewCompanyInformation } from './viewCompanyInformation';
import { editCompanyInformation } from './editCompanyInformation';
import { addStaff } from './addStaff';
import { viewCompanyRegistration } from './viewRegistration';
import { approveCompanyRegistration } from './approveCompany';
import { getAllCompany } from './getAllCompany';
import { deleteCompany } from './deleteCompany';
import { viewStaffList } from './viewStaffList';
import { removeStaff } from './removeStaff';
import { editStaff } from './editStaff';

const upload = multer({ storage: multer.memoryStorage() });

export const companyRouter = express.Router();

companyRouter.use('/signup', companySignup);
companyRouter.use('/login', companyLogin);

companyRouter.get(
  '/',
  authorization([StaffPermission.SUPER_ADMIN]),
  getAllCompany,
);

companyRouter.get(
  '/registration',
  authorization([StaffPermission.SUPER_ADMIN]),
  viewCompanyRegistration,
);

companyRouter.get(
  '/staff',
  authorization([StaffPermission.VIEW_STAFF]),
  viewStaffList,
);

companyRouter.put(
  '/staff/:id',
  authorization([StaffPermission.EDIT_STAFF]),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  editStaff,
);

companyRouter.delete(
  '/staff/:id',
  authorization([StaffPermission.DELETE_STAFF]),
  removeStaff,
);

companyRouter.get('/:companyId', viewCompanyInformation);

companyRouter.put(
  '/:companyId',
  authorization([StaffPermission.EDIT_COMPANY]),
  validator(schema.updateCompanyInfo),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'previewImages' }]),
  editCompanyInformation,
);

companyRouter.delete(
  '/:companyId',
  authorization([StaffPermission.DELETE_COMPANY]),
  deleteCompany,
);

companyRouter.post(
  '/staff',
  authorization([StaffPermission.ADD_STAFF]),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  addStaff,
);

companyRouter.put(
  '/registration/:companyId',
  authorization([StaffPermission.SUPER_ADMIN]),
  approveCompanyRegistration,
);
