import * as express from 'express';

import UsersController from './controllers/users';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const usersController = new UsersController();

  router.route('/user').post(usersController.register);

  app.use('/api', router);
}
