import * as mongoose from 'mongoose';

const DeckSchema = mongoose.Schema({
  name: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cards: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }
});

const Deck = mongoose.model('Deck', DeckSchema);

export default Deck;
