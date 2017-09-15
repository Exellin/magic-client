import Deck from '../models/deck';
import Card from '../models/card';

export default class CardsController {
  create = (req, res) => {
    Deck.findById(req.params.id, (err, deck) => {
      if (!deck) { return res.sendStatus(404); }

      const newCard = new Card(req.body);

      newCard.save((error, card) => {
        if (error) {
          res.status(422).send({
            status: 'error',
            data: newCard
          });
        } else {
          deck.cards.push(card);
          deck.save();
          res.status(200).send({
            status: 'success',
            data: card
          });
        }
      });
    });
  }

  update = (req, res) => {
    console.log(req.body);
    Card.findByIdAndUpdate(req.params.card_id, req.body, (err) => {
      if (err) { return res.sendStatus(422); }
      res.sendStatus(200);
    });
  }
}
