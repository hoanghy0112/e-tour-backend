import express from 'express';

import companyLogin from './login';
import companySignup from './signup';
import { viewCompanyInformation } from './viewCompanyInformation';

export const companyRouter = express.Router();

companyRouter.use('/signup', companySignup);
companyRouter.use('/login', companyLogin);
companyRouter.get('/:companyId', viewCompanyInformation);
