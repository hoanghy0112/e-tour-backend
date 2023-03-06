import express from 'express';
import signup from './company/signup';
// import login from './access/login';
// import token from './access/token';

const router = express.Router();

router.use('/signup', signup);
// router.use('/login', login);
// router.use('/token', token);

export default router;
