import * as express from 'express';

import UsersController from '../controllers/users';
import User from '../models/user';
import { ensureToken, verifyToken } from '../middleware/token';

export default function setRoutes(app) {

  const router = express.Router();

  const usersController = new UsersController();

  router.post('/user', usersController.register);
  router.post('/login', usersController.login);

  router.get('/protected', ensureToken, verifyToken, (req, res) => {
    res.json({user: req.user});
  });

  app.use('/api', router);
}
