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

const upload = multer({ storage: multer.memoryStorage() });

export const companyRouter = express.Router();

companyRouter.use('/signup', companySignup);
companyRouter.use('/login', companyLogin);
companyRouter.get('/:companyId', viewCompanyInformation);
companyRouter.put(
  '/:companyId',
  authorization([StaffPermission.EDIT_COMPANY]),
  validator(schema.updateCompanyInfo),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'previewImages' }]),
  editCompanyInformation,
);

companyRouter.post(
  '/staff',
  authorization([StaffPermission.ADD_STAFF]),
  validator(schema.addStaff),
  addStaff,
);

companyRouter.get(
  '/registration',
  authorization([StaffPermission.SUPER_ADMIN]),
  viewCompanyRegistration,
);

companyRouter.put(
  '/registration/:companyId',
  authorization([StaffPermission.SUPER_ADMIN]),
  approveCompanyRegistration,
);
