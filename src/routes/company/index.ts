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
