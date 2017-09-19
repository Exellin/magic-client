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
          quantity: card.quantity,
          _id: card._id._id,
          name: card._id.name,
          layout: card._id.layout,
          cmc: card._id.cmc,
          colors: card._id.colors,
          colorIdentity: card._id.colorIdentity,
          type: card._id.type,
          supertypes: card._id.supertypes,
          types: card._id.types,
          subtypes: card._id.subtypes,
          rarity: card._id.rarity,
          setCode: card._id.setCode,
          setName: card._id.setName,
          text: card._id.text,
          flavor: card._id.flavor,
          power: card._id.power,
          toughness: card._id.toughness,
          loyalty: card._id.loyalty,
          legalities: card._id.legalities,
          multiverseid: card._id.multiverseid,
          names: card._id.names,
          manaCost: card._id.manaCost,
          imageUrl: card._id.imageUrl,
          rulings: card._id.rulings,
          printings: card._id.printings
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
