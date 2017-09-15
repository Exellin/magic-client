import * as mongoose from 'mongoose';

const CardSchema = mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const Card = mongoose.model('Card', CardSchema);

export default Card;
