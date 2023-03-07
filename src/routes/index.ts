import express from 'express';
import companySignup from './company/signup';
import companyLogin from './company/login';
import userSignup from './user/access/signup';
import userLogin from './user/access/login';
// import clientLogin from './user/clientLogin';
// import token from './access/token';

const router = express.Router();

router.use('/company/signup', companySignup);
router.use('/company/login', companyLogin);
router.use('/user/signup', userSignup);
router.use('/user/login', userLogin);
// router.use('/login', clientLogin);
// router.use('/token', token);

export default router;
