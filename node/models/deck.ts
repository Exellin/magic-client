import * as mongoose from 'mongoose';

const DeckSchema = mongoose.Schema({
  name: { type: String, required: true },
  owner: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: { type: String, required: true }
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    }
  ]
});

const Deck = mongoose.model('Deck', DeckSchema);

export default Deck;
