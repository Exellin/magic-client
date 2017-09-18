import * as express from 'express';

import UsersController from '../controllers/users';
import DecksController from '../controllers/decks';
import CardsController from '../controllers/cards';

import { ensureToken, verifyToken } from '../middleware/token';
import { checkDeckOwnership } from '../middleware/ownership';

export default function setRoutes(app) {

  const router = express.Router();

  const usersController = new UsersController();
  const decksController = new DecksController();
  const cardsController = new CardsController();

  router.post('/user', usersController.register);
  router.post('/login', usersController.login);
  router.get('/user/:username', usersController.getUser);

  router.post('/deck', ensureToken, verifyToken, decksController.create);
  router.get('/decks/:id', decksController.get);
  router.put('/decks/:id', ensureToken, verifyToken, checkDeckOwnership, decksController.update);

  router.post('/card', ensureToken, verifyToken, cardsController.create);
  router.get('/cards/:card_name', ensureToken, verifyToken, cardsController.get);

  app.use('/api', router);
}
