import Deck from '../models/deck';

export function checkDeckOwnership (req, res, next) {
  Deck.findById(req.params.id, (err, deck) => {
    if (!deck) { return res.sendStatus(404); }

    if (deck.owner._id.equals(req.user.id)) {
      next();
    } else {
      return res.sendStatus(403);
    }
  });
}
