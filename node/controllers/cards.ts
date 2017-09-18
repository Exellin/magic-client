import Deck from '../models/deck';
import Card from '../models/card';

export default class CardsController {
  create = (req, res) => {
    const newCard = new Card(req.body);

    newCard.save((error, card) => {
      if (error) {
        res.status(422).send({
          status: 'error',
          data: newCard
        });
      } else {
        res.status(200).send({
          status: 'success',
          data: card
        });
      }
    });
  }

  get = (req, res) => {
    Card.findOne({ name: req.params.card_name }, (err, card) => {
      if (err) { return console.error(err); }

      res.status(200).send({
        status: 'success',
        data: card
      });
    }).collation({ locale: 'en', strength: 1 }); // performs case insensitive search
  }

  update = (req, res) => {
    Card.findByIdAndUpdate(req.params.card_id, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}
