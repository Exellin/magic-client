import * as mongoose from 'mongoose';
import Deck from '../models/deck';

export default class DecksController {
  create = (req, res) => {
    const newDeck = new Deck({
      name: req.body.name,
      owner: {
        _id: req.user.id,
      }
    });

    newDeck.save((err, deck) => {
      if (err) {
        res.status(422).send({
          status: 'error',
          data: newDeck
        });
      } else {
        res.status(200).send({
          status: 'success',
          data: deck
        });
      }
    });
  }
}
