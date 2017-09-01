import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

import User from '../models/user';

export default class UsersController {
  register = (req, res, next) => {
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    newUser.save((err, user) => {
      if (err) {
        console.log(err);
        res.json({success: false, msg: 'Failed to register user'});
      } else {
        res.json({success: true, msg: 'User registered'});
      }
    });
  }
}
