import express from 'express';
import companySignup from './company/signup';
import companyLogin from './company/login';
import userSignup from './user/access/signup';
import userLogin from './user/access/login';
import profileRouter from './user/access/profile';
import imageRouter from './imageStorage/image';
import demoRouter from './demo';

const router = express.Router();

router.use('/company/signup', companySignup);
router.use('/company/login', companyLogin);
router.use('/user/signup', userSignup);
router.use('/user/login', userLogin);
router.use('/user/profile', profileRouter);
router.use('/images', imageRouter);

router.use('/demo', demoRouter);

export default router;
