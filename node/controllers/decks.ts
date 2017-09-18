import Deck from '../models/deck';
import Card from '../models/card';

export default class DecksController {
  create = (req, res) => {
    const newDeck = new Deck({
      name: req.body.name,
      owner: {
        _id: req.user.id,
        username: req.user.username
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
    Deck.findById(req.params.id).populate({path: 'cards._id', model: 'Card'}).lean().exec((err, deck) => {
      if (!deck) { return res.sendStatus(404); }

      const cardsToSend = [];

      for (const card of deck.cards) {
        const cardToSend = {
          _id: card._id._id,
          quantity: card.quantity,
          name: card._id.name,
          imageUrl: card._id.imageUrl
        };

        cardsToSend.push(cardToSend);
      }

      deck.cards = cardsToSend;

      res.status(200).send({
        status: 'success',
        data: deck
      });
    });
  }

  update = (req, res) => {
    Deck.findByIdAndUpdate(req.params.id, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}
