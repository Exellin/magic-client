import * as jwt from 'jsonwebtoken';

export function ensureToken (req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader === 'undefined') {
    res.sendStatus(403);
  } else {
    req.token = bearerHeader.split(' ')[1];
    next();
  }
}

export function verifyToken (req, res, next) {
  jwt.verify(req.token, process.env.SECRET_TOKEN, function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      req.user = data.user;
      next();
    }
  });
}
