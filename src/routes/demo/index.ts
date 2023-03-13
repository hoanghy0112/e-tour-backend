import express from 'express';
import testAuthenticationRouter from './authentication';
import testAuthorizationRouter from './authorization';

const demoRouter = express.Router();

demoRouter.use('/authentication', testAuthenticationRouter);
demoRouter.use('/authorization', testAuthorizationRouter);

export default demoRouter;
