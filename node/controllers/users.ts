import * as jwt from 'jsonwebtoken';

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

  login = (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
      if (!user) { return res.sendStatus(403); }

      const passedUser = {
        id: user._id,
        username: user.username,
        email: user.email
      };

      User.comparePassword(req.body.password, user.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: passedUser }, process.env.SECRET_TOKEN, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: passedUser
        });
      });
    });
  }
}
