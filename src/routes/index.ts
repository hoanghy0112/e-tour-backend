import express from 'express';
import authentication from '../auth/authentication';
import companyLogin from './company/login';
import companySignup from './company/signup';
import demoRouter from './demo';
import imageRouter from './imageStorage/image';
import userLogin from './user/access/login';
import profileRouter from './user/access/profile';
import userSignup from './user/access/signup';
import cardRouter from './user/card';
import reportRouter from './report';
import { ticketRouter } from './user/ticket';
import { voucherRouter } from './voucher';

const router = express.Router();

router.use('/company/signup', companySignup);
router.use('/company/login', companyLogin);
router.use('/user/signup', userSignup);
router.use('/user/login', userLogin);
router.use('/user/profile', profileRouter);
router.use('/images', imageRouter);
router.use('/user/card', authentication.userAuthentication, cardRouter);
router.use('/report', reportRouter);
router.use('/ticket', authentication.userAuthentication, ticketRouter);
router.use('/voucher', voucherRouter);

router.use('/demo', demoRouter);

export default router;
