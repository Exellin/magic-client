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
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      },
      quantity: { type: Number, required: true },
      imageUrls: {
        small: { type: String, required: true },
        normal: { type: String, required: true },
        large: { type: String, required: true }
      }
    }
  ]
});

const Deck = mongoose.model('Deck', DeckSchema);

export default Deck;
