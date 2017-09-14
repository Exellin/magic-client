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

  get = (req, res) => {
    Deck.findById(req.params.id, (err, deck) => {
      if (!deck) { return res.sendStatus(404); }

      res.status(200).send({
        status: 'success',
        data: deck
      });
    });
  }
}
