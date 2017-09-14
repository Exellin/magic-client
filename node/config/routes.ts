import * as express from 'express';

import UsersController from '../controllers/users';
import DecksController from '../controllers/decks';

import { ensureToken, verifyToken } from '../middleware/token';

export default function setRoutes(app) {

  const router = express.Router();

  const usersController = new UsersController();
  const decksController = new DecksController();

  router.post('/user', usersController.register);
  router.post('/login', usersController.login);
  router.get('/user/:username', usersController.getUser);

  router.post('/deck', ensureToken, verifyToken, decksController.create);
  router.get('/decks/:id', decksController.get);

  app.use('/api', router);
}
