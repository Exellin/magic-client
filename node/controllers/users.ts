import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import Deck from '../models/deck';

export default class UsersController {
  register = (req, res) => {
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    newUser.save((err, user) => {
      let errorMessage = '';
      if (err && err.code === 11000 && err.message.includes('username')) {
        errorMessage = 'Username already exists';
      }
      if (err && err.code === 11000 && err.message.includes('email')) {
        errorMessage = 'Email already exists';
      }

      if (err) {
        res.status(422).send({
          status: 'error',
          data: newUser,
          error: errorMessage
        });
      } else {
        res.status(200).send({
          status: 'success',
          data: user
        });
      }
    });
  }

  login = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }

      const encodedUser = {
        id: user._id,
        username: user.username,
        email: user.email
      };

      User.comparePassword(req.body.password, user.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: encodedUser }, process.env.SECRET_TOKEN, {
          expiresIn: 604800 // 1 week
        });

        res.status(200).send({
          status: 'success',
          token: `Bearer ${token}`
        });
      });
    });
  }

  getUser = (req, res) => {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (!user) { return res.sendStatus(404); }

      const ownerQuery = {
        _id: user._id,
        username: user.username
      };

      Deck.find({owner: ownerQuery}).exec((error, decks) => {
        if (error) { return console.error(error); }

        const passedUser = {
          username: user.username,
          decks: decks
        };

        res.status(200).send({
          status: 'success',
          user: passedUser
        });
      });
    });
  }
}
